import * as React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { BaseStylesDiv, SpanContainer } from "../../styles";
import { useTweet } from "../TweetContext";

const StyledReplyLink = styled.span`
  color: var(--colors-button);
  :hover {
    text-decoration: underline;
  }
`;

export const ReplyingTo: React.FC = () => {
  const { tweet, prevTweet } = useTweet();

  const { tweetId } = useParams<{ tweetId: string }>();

  return (
    <BaseStylesDiv style={{ margin: "0 0 4px 0" }}>
      {prevTweet &&
      tweet.inReplyToId !== null &&
      tweet.inReplyToId !== prevTweet.id &&
      tweet.inReplyToId !== tweetId ? (
        <SpanContainer grey>
          <span id="link">Replying to</span>{" "}
          <Link
            to={`/user/${tweet!.owner!.username}`}
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <StyledReplyLink>@{tweet.inReplyToUsername}</StyledReplyLink>
          </Link>
        </SpanContainer>
      ) : null}
    </BaseStylesDiv>
  );
};
