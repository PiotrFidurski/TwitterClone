import * as React from "react";
import {
  EditorState,
  Editor as DraftEditor,
  RichUtils,
  DraftHandleValue,
} from "draft-js";
import { useLocation } from "react-router-dom";
import { useDropdownCtxt } from "../DropDown";
import { StyledEditorContainer, StyledEditorWrapper } from "./styles";
import { EditorProps } from "./types";

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
    if (
      editorState.getCurrentContent().getPlainText().length &&
      !emojiPickerOpen
    )
      focusRef?.current?.focus();
  }, [location, emojiPickerOpen, editorState]);

  const handleReturn = (
    e: React.SyntheticEvent<any, KeyboardEvent>,
    state: EditorState
  ) => {
    const handled: DraftHandleValue = "handled";
    setState(RichUtils.insertSoftNewline(state));
    return handled;
  };

  return (
    <StyledEditorContainer>
      <StyledEditorWrapper>
        <DraftEditor
          ref={focusRef}
          handleReturn={handleReturn}
          onChange={handleChange}
          editorState={editorState}
          spellCheck={true}
          placeholder="What's happening?"
        />
      </StyledEditorWrapper>
    </StyledEditorContainer>
  );
};
