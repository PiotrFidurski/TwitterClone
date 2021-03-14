import * as React from "react";
import { LikePostMutation, useAuthUserQuery } from "../../generated/graphql";
import { ReactComponent as Liked } from "../svgs/Liked.svg";
import { ReactComponent as NotLiked } from "../svgs/NotLiked.svg";
import {
  Absolute,
  BaseStylesDiv,
  HoverContainer,
  InteractiveIcon,
  SpanContainer,
} from "../../styles";
import { usePost } from "../PostContext";
import { useMutation } from "@apollo/client";
import { LikePostDocument } from "../../generated/introspection-result";
import { useModalContext } from "../context/ModalContext";

export const LikePost = () => {
  const { openModal, setOpen } = useModalContext();
  const { data } = useAuthUserQuery();
  const { post } = usePost();
  const [likePost] = useMutation(LikePostDocument, {
    variables: { id: post.id },
  });

  const handleLikePost = (e: any) => {
    e.stopPropagation();
    if (!data!.authUser!.username) {
      return openModal("loginAlert", { closeModal: setOpen });
    }
    likePost({
      optimisticResponse: {
        __typename: "Mutation",
        likePost: {
          __typename: "UpdateResourceResponse",
          node: {
            __typename: "Post",
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked
              ? post.likesCount! - 1
              : post.likesCount! + 1,
          },
        },
      } as LikePostMutation,
    });
  };

  return (
    <InteractiveIcon color="rgb(224, 36, 94)">
      <HoverContainer onClick={(e) => handleLikePost(e)}>
        <BaseStylesDiv>
          <Absolute biggerMargin />
          {post.isLiked ? <Liked /> : <NotLiked />}
        </BaseStylesDiv>
        <SpanContainer
          textCenter
          smaller
          grey
          style={{
            color: `${
              post.isLiked ? "rgb(224, 36, 94)" : "var(--colors-secondarytext)"
            }`,
          }}
        >
          <span>{post.likesCount! > 0 && post.likesCount}</span>
        </SpanContainer>
      </HoverContainer>
    </InteractiveIcon>
  );
};
