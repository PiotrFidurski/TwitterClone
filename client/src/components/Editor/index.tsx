import * as React from "react";
import {
  EditorState,
  Editor as DraftEditor,
  RichUtils,
  DraftHandleValue,
} from "draft-js";
import { BaseStyles } from "../../styles";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useDropdownCtxt } from "../DropDown";

const StyledContainer = styled.div`
  ${BaseStyles};
  padding: 10px 0;
`;

const StyledWrapper = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  width: 0px;
  > :first-child {
    flex-grow: 1;
    width: 0px;
    font-size: 19px;
  }
`;

interface EditorProps {
  editorState: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

export const Editor: React.FC<EditorProps> = ({
  editorState,
  setState,
  setFieldValue,
}) => {
  const focusRef = React.useRef<DraftEditor | null>(null);
  const location = useLocation();
  const {
    state: { open: emojiPickerOpen },
  } = useDropdownCtxt();

  const handleChange = (state: EditorState) => {
    setFieldValue("body", state.getCurrentContent().getPlainText());
    setState(state);
  };

  React.useEffect(() => {
    if (location.pathname === "/posts/compose") {
      focusRef?.current?.focus();
    }
    if (!emojiPickerOpen) {
      focusRef?.current?.focus();
    }
  }, [location, emojiPickerOpen]);

  const handleReturn = (
    e: React.SyntheticEvent<any, KeyboardEvent>,
    state: EditorState
  ) => {
    const handled: DraftHandleValue = "handled";
    setState(RichUtils.insertSoftNewline(state));
    return handled;
  };

  return (
    <StyledContainer>
      <StyledWrapper>
        <DraftEditor
          ref={focusRef}
          handleReturn={handleReturn}
          onChange={handleChange}
          editorState={editorState}
          spellCheck={true}
          placeholder="What's happening?"
        />
      </StyledWrapper>
    </StyledContainer>
  );
};
