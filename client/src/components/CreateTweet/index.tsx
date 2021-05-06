import * as React from "react";
import { AvatarContainer, PlaceHolder, StyledAvatar } from "../../styles";
import { User } from "../../generated/graphql";
import "react-circular-progressbar/dist/styles.css";
import { Form } from "./Form";
import { StyledAvatarWrapper } from "../TweetComposition/styles";
import { StyledContainer, StyledWrapper } from "./styles";

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
