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
import { useModalContext } from "../context/ModalContext";

export const LikeTweet = () => {
  const { openModal, setOpen } = useModalContext();
  const { data } = useAuthUserQuery();
  const { tweet } = useTweet();
  const [likePost] = useMutation(LikeTweetDocument, {
    variables: { tweetId: tweet.id },
  });

  const handleLikePost = (e: any) => {
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
            isLiked: !tweet.isLiked,
            likesCount: tweet.isLiked
              ? tweet.likesCount! - 1
              : tweet.likesCount! + 1,
          },
        },
      } as LikeTweetMutation,
    });
  };

  return (
    <InteractiveIcon color="rgb(224, 36, 94)">
      <HoverContainer onClick={(e) => handleLikePost(e)}>
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
          <span>{tweet.likesCount! > 0 && tweet.likesCount}</span>
        </SpanContainer>
      </HoverContainer>
    </InteractiveIcon>
  );
};
