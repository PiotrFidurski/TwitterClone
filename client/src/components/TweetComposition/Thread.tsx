import * as React from "react";
import { PlaceHolder, Connector } from "../../styles";
import { useTweet } from "../TweetContext";
import { StyledSpacingWrapper } from "./styles";

export const Thread: React.FC = () => {
  const { prevTweet, tweet } = useTweet();

  const isReply = !!(
    prevTweet &&
    tweet!.id !== tweet!.conversationId &&
    ((prevTweet && prevTweet!.id === tweet!.inReplyToId!) ||
      prevTweet!.id === tweet!.conversationId!)
  );

  return (
    <PlaceHolder noPadding={isReply}>
      <StyledSpacingWrapper>
        {isReply ? <Connector isReply /> : null}
      </StyledSpacingWrapper>
    </PlaceHolder>
  );
};
