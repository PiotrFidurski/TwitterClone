import * as React from "react";
import {
  EditorState,
  Editor as DraftEditor,
  RichUtils,
  DraftHandleValue,
} from "draft-js";
import { useLocation } from "react-router-dom";
import { useDropdown } from "../DropDown/context";
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
  } = useDropdown();

  const hasContent = editorState.getCurrentContent().getPlainText().length;

  const handleChange = (state: EditorState) => {
    setFieldValue("body", state.getCurrentContent().getPlainText());
    setState(state);
  };

  React.useEffect(() => {
    if (location.pathname === "/posts/compose") {
      focusRef?.current?.focus();
    }
  }, [location]);

  React.useEffect(() => {
    if (hasContent && !emojiPickerOpen) focusRef?.current?.focus();
  }, [hasContent, emojiPickerOpen]);

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
