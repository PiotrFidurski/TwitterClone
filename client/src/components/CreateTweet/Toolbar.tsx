import * as React from "react";
import {
  ButtonContainer,
  SpanContainer,
  BaseStyles,
  BaseStylesDiv,
} from "../../styles";
import { ReactComponent as SadFace } from "../../components/svgs/SadFace.svg";
import { EditorState } from "draft-js";
import { ProgressCircle } from "./ProgressCircle";
import styled from "styled-components";
import { DropdownProvider } from "../DropDown";

const StyledEmojiPickerContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 32px;
  height: 32px;
  justify-content: center;
  :hover {
    cursor: pointer;
    border-radius: 9999px;
    background-color: var(--colors-button-hover-opacity);
  }
`;

export const StyledContainer = styled.div`
  ${BaseStyles};
  align-items: center;
`;

export const StyledProgressCircleContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: flex-end;
  padding: 0 15px 1px 0;
`;

interface Props {
  state: EditorState;
}

export const Toolbar: React.FC<Props> = ({ state }) => {
  return (
    <StyledContainer>
      <DropdownProvider.Toggle>
        <StyledEmojiPickerContainer>
          <BaseStylesDiv
            style={{
              alignItems: "center",
            }}
          >
            <SadFace height="1.4em" width="1.4em" fill="var(--colors-button)" />
          </BaseStylesDiv>
        </StyledEmojiPickerContainer>
      </DropdownProvider.Toggle>

      <BaseStylesDiv
        flexGrow
        style={{ justifyContent: "flex-end", alignItems: "center" }}
      >
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
      </BaseStylesDiv>
    </StyledContainer>
  );
};
