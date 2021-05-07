import * as React from "react";
import { Link } from "react-router-dom";
import { SpanContainer } from "../../styles";
import { useTweet } from "../TweetContext";
import {
  ShowMoreContainer,
  ShowMoreWrapper,
  ThreadLineContainer,
  Dot,
} from "./styles";

export const ShowThread: React.FC = () => {
  const { tweet, prevTweet } = useTweet();

  return prevTweet &&
    prevTweet.conversationId === prevTweet.id &&
    prevTweet.id !== tweet.inReplyToId! &&
    prevTweet.conversationId! === tweet.conversationId! ? (
    <Link
      style={{ textDecoration: "none" }}
      to={`/${tweet.owner!.username}/status/${tweet!.conversationId}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ShowMoreContainer>
        <ShowMoreWrapper>
          <ThreadLineContainer>
            <Dot />
            <Dot />
            <Dot />
          </ThreadLineContainer>
          <SpanContainer grey>
            <span style={{ color: "var(--colors-button)" }}>
              Show this thread
            </span>
          </SpanContainer>
        </ShowMoreWrapper>
      </ShowMoreContainer>
    </Link>
  ) : null;
};
