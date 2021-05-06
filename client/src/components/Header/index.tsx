import * as React from "react";
import { HoverContainer, Absolute, SpanContainer } from "../../styles";
import { ReactComponent as ArrowLeft } from "../svgs/ArrowLeft.svg";
import { useHistory } from "react-router-dom";
import { ReactComponent as Caret } from "../svgs/Caret.svg";
import { StyledContainer, StyledWrapper } from "./styles";

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
