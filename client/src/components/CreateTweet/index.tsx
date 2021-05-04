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
  padding: 0 15px 15px 15px;
`;

interface Props {
  user: User;
  tweetToReplyTo?: {
    conversationId: string | undefined;
    tweetId: string | undefined;
  };
}

export const CreateTweet: React.FC<Props> = React.memo(
  ({ user, tweetToReplyTo }) => {
    return (
      <StyledContainer>
        <PlaceHolder
          noPadding={tweetToReplyTo && !!tweetToReplyTo!.conversationId!}
        />
        <StyledWrapper>
          <StyledAvatarWrapper>
            <AvatarContainer width={49} height="49px">
              <StyledAvatar url={user!.avatar!} />
            </AvatarContainer>
          </StyledAvatarWrapper>
          <Form tweetToReplyTo={tweetToReplyTo} />
        </StyledWrapper>
      </StyledContainer>
    );
  }
);
