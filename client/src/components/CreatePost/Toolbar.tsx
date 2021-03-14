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
  loading: boolean;
}

export const Toolbar: React.FC<Props> = ({ state, loading }) => {
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
            <span>
              {loading ? (
                <Spinner
                  style={{ margin: "0 7.5px", width: "19px", height: "19px" }}
                />
              ) : (
                "Tweet"
              )}
            </span>
          </SpanContainer>
        </ButtonContainer>
      </div>
    </StyledContainer>
  );
};
