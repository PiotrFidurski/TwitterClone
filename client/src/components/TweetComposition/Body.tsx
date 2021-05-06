import * as React from "react";
import { BaseStylesDiv, SpanContainer } from "../../styles";
import { useTweet } from "../TweetContext";
import { Twemoji } from "../TwemojiPicker/Twemoji";

export interface BodyProps {
  biggest?: boolean;
}

export const Body: React.FC<BodyProps> = ({ biggest }) => {
  const { tweet } = useTweet();
  return (
    <BaseStylesDiv flexShrink>
      <BaseStylesDiv
        flexGrow
        style={{ flexBasis: "0px", width: "0px", minWidth: "0px" }}
      >
        <SpanContainer biggest={biggest} breakSpaces>
          <span>
            <Twemoji>{tweet!.body}</Twemoji>
          </span>
        </SpanContainer>
      </BaseStylesDiv>
    </BaseStylesDiv>
  );
};
