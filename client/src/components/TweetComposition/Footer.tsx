import { useQuery } from "@apollo/client";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { AuthUserQuery, AuthUserDocument } from "../../generated/graphql";
import {
  BaseStylesDiv,
  InteractiveIcon,
  HoverContainer,
  StyledLink,
  Absolute,
  SpanContainer,
} from "../../styles";
import { useModalContext } from "../context/ModalContext";
import { useTweet } from "../TweetContext";
import { ReactComponent as Retweet } from "../svgs/Retweet.svg";
import { ReactComponent as Options } from "../svgs/Options.svg";
import { ReactComponent as Reply } from "../svgs/Reply.svg";
import { LikeTweet } from "./LikeTweet";
import { StyledFooterWrapper } from "./styles";

export interface FooterProps {
  marginAuto?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ marginAuto }) => {
  const { openModal, setOpen } = useModalContext();
  const { data } = useQuery<AuthUserQuery>(AuthUserDocument, {
    fetchPolicy: "cache-only",
  });
  const { tweet } = useTweet();
  const location = useLocation();
  return (
    <BaseStylesDiv flexGrow>
      <StyledFooterWrapper marginAuto={marginAuto}>
        <InteractiveIcon color={"rgb(29, 161, 242)"}>
          <HoverContainer
            onClick={(e) => {
              e.stopPropagation();
              openModal("loginAlert", { closeModal: setOpen });
            }}
          >
            <StyledLink
              to={
                data && data!.authUser!.username
                  ? {
                      pathname: "/posts/compose",
                      state: {
                        isModalLocaction: location,
                        tweetId: tweet!.id,
                      },
                    }
                  : {}
              }
            >
              <BaseStylesDiv>
                <Absolute biggerMargin />
                <Reply />
              </BaseStylesDiv>
              <SpanContainer smaller textCenter>
                <span>{tweet.replyCount! > 0 ? tweet.replyCount! : null}</span>
              </SpanContainer>
            </StyledLink>
          </HoverContainer>
        </InteractiveIcon>
        <InteractiveIcon color="rgb(23, 191, 99)">
          <HoverContainer onClick={(e) => e.stopPropagation()}>
            <Absolute biggerMargin />
            <Retweet />
          </HoverContainer>
        </InteractiveIcon>
        <LikeTweet />
        <InteractiveIcon color="rgb(29, 161, 242)" style={{ flexGrow: 0 }}>
          <HoverContainer onClick={(e) => e.stopPropagation()}>
            <Absolute biggerMargin />
            <Options />
          </HoverContainer>
        </InteractiveIcon>
      </StyledFooterWrapper>
    </BaseStylesDiv>
  );
};
