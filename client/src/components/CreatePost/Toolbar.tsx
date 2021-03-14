import * as React from "react";
import {
  ButtonContainer,
  SpanContainer,
  BaseStyles,
  Spinner,
} from "../../styles";
import { EditorState } from "draft-js";
import { ProgressCircle } from "./ProgressCircle";
import styled from "styled-components";

export const StyledContainer = styled.div`
  ${BaseStyles};
  justify-content: flex-end;
  align-items: center;
`;

export const StyledProgressCircleContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: flex-end;
  padding: 15px;
`;

interface Props {
  state: EditorState;
}

export const Toolbar: React.FC<Props> = ({ state }) => {
  return (
    <StyledContainer>
      <div>
        <StyledProgressCircleContainer>
          <ProgressCircle editorState={state} />
        </StyledProgressCircleContainer>
      </div>
      <div>
        <ButtonContainer
          filledVariant
          type="submit"
          disabled={
            !!(
              state.getCurrentContent().getPlainText().length <= 0 ||
              state.getCurrentContent().getPlainText().length > 280
            )
          }
        >
          <SpanContainer bold>
            <span>Tweet</span>
          </SpanContainer>
        </ButtonContainer>
      </div>
    </StyledContainer>
  );
};
