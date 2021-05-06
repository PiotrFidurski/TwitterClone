import * as React from "react";
import { BaseStylesDiv, SpanContainer } from "../../styles";
import { useHistory } from "react-router-dom";
import { Tweet } from "../../generated/graphql";
import {
  ShowMoreContainer,
  ShowMoreWrapper,
  ThreadLineContainer,
  Dot,
} from "./styles";

interface Props {
  tweet: Tweet;
  isTweetView: boolean;
}

export const ShowMore: React.FC<Props> = ({ tweet, children, isTweetView }) => {
  const history = useHistory();

  const handleClick = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
    history.push(`${tweet.owner!.username}/status/${tweet!.conversationId}`);
  };

  return (
    <BaseStylesDiv
      style={{ textDecoration: "none" }}
      onClick={(e) => {
        !isTweetView && handleClick(e);
      }}
    >
      <ShowMoreContainer>
        <ShowMoreWrapper>
          <ThreadLineContainer>
            <Dot />
            <Dot />
            <Dot />
          </ThreadLineContainer>
          <SpanContainer grey bold>
            <span>{children}</span>
          </SpanContainer>
        </ShowMoreWrapper>
      </ShowMoreContainer>
    </BaseStylesDiv>
  );
};
