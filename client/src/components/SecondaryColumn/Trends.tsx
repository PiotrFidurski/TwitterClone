import * as React from "react";
import { ReactComponent as Caret } from "../svgs/Caret.svg";
import { StyledSecondaryContainer, StyledHoverWrapper } from "./styles";
import { HoverContainer, Absolute, SpanContainer } from "../../styles";
import { StyledHeader } from "./SuggestedUsers/styles";

export const Trends = () => (
  <StyledSecondaryContainer>
    <StyledHoverWrapper>
      <StyledHeader>
        <SpanContainer bigger bolder>
          <span>United States trends</span>
        </SpanContainer>
        <HoverContainer>
          <Absolute biggerMargin />
          <Caret />
        </HoverContainer>
      </StyledHeader>
    </StyledHoverWrapper>
    <Trend />
    <Trend />
    <Trend />
    <Trend />
    <div style={{ padding: "10px 15px 10px 15px" }}>
      <SpanContainer>
        <span>Show More</span>
      </SpanContainer>
    </div>
  </StyledSecondaryContainer>
);

export const Trend = () => (
  <StyledHoverWrapper hover>
    <StyledHeader>
      <SpanContainer smaller grey>
        <span>1</span>
        <SpanContainer grey padding>
          <span>·</span>
        </SpanContainer>
        <span>Trending</span>
      </SpanContainer>
      <HoverContainer>
        <Absolute />
        <Caret />
      </HoverContainer>
    </StyledHeader>
    <SpanContainer bold>
      <span>#ThursdayThoughts</span>
    </SpanContainer>
    <div>
      <SpanContainer smaller grey>
        <span>65.2K Tweets</span>
      </SpanContainer>
    </div>
  </StyledHoverWrapper>
);
