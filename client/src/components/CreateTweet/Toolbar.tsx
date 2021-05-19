import * as React from "react";
import { ButtonContainer, SpanContainer, BaseStylesDiv } from "../../styles";
import { ReactComponent as SadFace } from "../../components/svgs/SadFace.svg";
import { EditorState } from "draft-js";
import { ProgressCircle } from "./ProgressCircle";
import { DropdownProvider } from "../DropDown/context";
import {
  StyledEmojiPickerContainer,
  StyledProgressCircleContainer,
  StyledToolbarContainer,
} from "./styles";

interface Props {
  state: EditorState;
}

export const Toolbar: React.FC<Props> = ({ state }) => {
  return (
    <StyledToolbarContainer>
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
    </StyledToolbarContainer>
  );
};
