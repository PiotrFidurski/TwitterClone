import * as React from "react";
import {
  HoverContainer,
  Absolute,
  BaseStyles,
  SpanContainer,
} from "../../styles";
import { ReactComponent as ArrowLeft } from "../svgs/ArrowLeft.svg";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as Caret } from "../svgs/Caret.svg";

export const StyledContainer = styled.div`
  ${BaseStyles};
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--colors-border);
  z-index: 3;
  min-height: 53px;
  flex-direction: row;
  background-color: var(--colors-mainbackground);
`;

export const StyledWrapper = styled.div<{ flexStart?: boolean }>`
  ${BaseStyles};
  color: white;
  flex-grow: 1;
  margin: auto;
  align-items: center;
  justify-content: ${(props) =>
    props.flexStart ? "flex-start" : "space-between"};
  padding: 0 15px 0 15px;
`;

interface Props {
  justifyStart: boolean;
}

export const Header: React.FC<Props> = ({ children, justifyStart }) => {
  const { goBack } = useHistory();
  return (
    <StyledContainer>
      <StyledWrapper flexStart={justifyStart}>
        {justifyStart && (
          <HoverContainer onClick={goBack} style={{ marginRight: "15px" }}>
            <Absolute biggerMargin />
            <ArrowLeft />
          </HoverContainer>
        )}

        <SpanContainer bigger bolder style={{ flexGrow: 1 }}>
          {children}
        </SpanContainer>

        {!justifyStart && (
          <HoverContainer>
            <Absolute />
            <Caret />
          </HoverContainer>
        )}
      </StyledWrapper>
    </StyledContainer>
  );
};
