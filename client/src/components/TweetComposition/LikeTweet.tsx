import * as React from "react";
import { LikeTweetMutation, useAuthUserQuery } from "../../generated/graphql";
import { ReactComponent as Liked } from "../svgs/Liked.svg";
import { ReactComponent as NotLiked } from "../svgs/NotLiked.svg";
import {
  Absolute,
  BaseStylesDiv,
  HoverContainer,
  InteractiveIcon,
  SpanContainer,
} from "../../styles";
import { useTweet } from "../TweetContext";
import { useMutation } from "@apollo/client";
import { LikeTweetDocument } from "../../generated/introspection-result";
import { useModal } from "../context/ModalContext";
import { formatNumToK } from "../../utils/functions";

export const LikeTweet = React.memo(() => {
  const { openModal, setOpen } = useModal();
  const { data } = useAuthUserQuery();
  const { tweet } = useTweet();
  const [likePost] = useMutation(LikeTweetDocument, {
    variables: { tweetId: tweet.id },
  });

  function handleLikePost(e: React.BaseSyntheticEvent) {
    e.stopPropagation();
    if (!data!.authUser!.username) {
      return openModal("loginAlert", { closeModal: setOpen });
    }
    likePost({
      optimisticResponse: {
        __typename: "Mutation",
        likeTweet: {
          __typename: "UpdateResourceResponse",
          status: true,
          node: {
            __typename: "Tweet",
            ...tweet,
            likes: [],
            isLiked: !tweet.isLiked,
            likesCount: tweet.isLiked
              ? tweet.likesCount! - 1
              : tweet.likesCount! + 1,
          },
        },
      } as LikeTweetMutation,
    });
  }

  return (
    <InteractiveIcon color="rgb(224, 36, 94)">
      <HoverContainer onClick={handleLikePost}>
        <BaseStylesDiv>
          <Absolute biggerMargin />
          {tweet.isLiked ? <Liked /> : <NotLiked />}
        </BaseStylesDiv>
        <SpanContainer
          textCenter
          smaller
          grey
          style={{
            color: `${
              tweet.isLiked ? "rgb(224, 36, 94)" : "var(--colors-secondarytext)"
            }`,
          }}
        >
          <span>
            {tweet.likesCount! > 0 && formatNumToK(tweet.likesCount!)}
          </span>
        </SpanContainer>
      </HoverContainer>
    </InteractiveIcon>
  );
});
