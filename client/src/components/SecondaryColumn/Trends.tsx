import * as React from "react";
import { ReactComponent as Caret } from "../svgs/Caret.svg";
import { StyledContainer, StyledWrapper } from "./styles";
import {
  HoverContainer,
  Absolute,
  SpanContainer,
  BaseStyles,
} from "../../styles";
import styled from "styled-components";

const StyledHeader = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
`;

export const Trends = () => (
  <StyledContainer>
    <StyledWrapper>
      <StyledHeader>
        <SpanContainer bigger bolder>
          <span>United States trends</span>
        </SpanContainer>
        <HoverContainer>
          <Absolute biggerMargin />
          <Caret />
        </HoverContainer>
      </StyledHeader>
    </StyledWrapper>
    <Trend />
    <Trend />
    <Trend />
    <Trend />
    <div style={{ padding: "10px 15px 10px 15px" }}>
      <SpanContainer>
        <span>Show More</span>
      </SpanContainer>
    </div>
  </StyledContainer>
);

export const Trend = () => (
  <StyledWrapper hover>
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
  </StyledWrapper>
);
