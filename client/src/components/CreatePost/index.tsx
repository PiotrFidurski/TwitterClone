import * as React from "react";
import {
  AvatarContainer,
  PlaceHolder,
  StyledAvatar,
  BaseStyles,
} from "../../styles";
import { User } from "../../generated/graphql";
import "react-circular-progressbar/dist/styles.css";
import { Form } from "./Form";
import styled from "styled-components";
import { StyledAvatarWrapper } from "../PostComposition/styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  margin-top: 5px;
`;

export const StyledWrapper = styled.div`
  ${BaseStyles};
  color: var(--colors-maintext);
  flex-grow: 1;
  justify-content: flex-start;
  padding: 0 15px 0 15px;
`;

interface Props {
  user: User;
  postToReplyTo?: {
    conversationId: string | undefined;
    postId: string | undefined;
  };
}

export const CreatePost: React.FC<Props> = React.memo(
  ({ user, postToReplyTo }) => {
    return (
      <StyledContainer>
        <PlaceHolder
          noPadding={postToReplyTo && !!postToReplyTo!.conversationId!}
        />
        <StyledWrapper>
          <StyledAvatarWrapper>
            <AvatarContainer width="49px" height="49px">
              <StyledAvatar url={user!.avatar!} />
            </AvatarContainer>
          </StyledAvatarWrapper>
          <Form postToReplyTo={postToReplyTo} />
        </StyledWrapper>
      </StyledContainer>
    );
  }
);
