import * as React from "react";
import { EditorState, DraftHandleValue, Modifier } from "draft-js";
import { useLocation } from "react-router-dom";
import { useDropdownCtxt } from "../../../components/DropDown";
import Editor from "@draft-js-plugins/editor";
import "@draft-js-plugins/emoji/lib/plugin.css";
import styled from "styled-components";
import { BaseStyles } from "../../../styles";

const StyledEditorContainer = styled.div`
  ${BaseStyles};
  z-index: 0;
  display: flex;
  flex-grow: 1;
  padding: 5.5px;
  flex-direction: column;
  width: 0px;
  color: var(--colors-maintext);
  margin: 0px 10px;
  line-height: 1.3125;
  height: 100%;
  max-width: 490px;
  width: 90%;
  font-size: 15px;
  max-height: 125px;
  overflow-y: auto;
  overflow-wrap: break-word;
`;

export const ChatEditor: React.FC<any> = ({
  handleSubmission,
  state,
  plugin,
  setState,
  setFieldValue,
}) => {
  const editorRef = React.useRef<Editor | null>(null);

  const { state: dropdownState } = useDropdownCtxt();
  const location = useLocation();
  const handleReturn = (e: React.KeyboardEvent, state: EditorState) => {
    const handled: DraftHandleValue = "handled";
    const notHandled: DraftHandleValue = "not-handled";
    if (e.shiftKey) return notHandled;

    if (
      e.key === "Enter" &&
      state.getCurrentContent().getPlainText().length >= 1
    ) {
      handleSubmission();
      return handled;
    }
    return handled;
  };

  React.useEffect(() => {
    if (editorRef && editorRef.current && dropdownState) {
      editorRef!.current!.focus();
    }
  }, [location, dropdownState.open, dropdownState]);

  const handleChange = (state: EditorState) => {
    setFieldValue("text", state.getCurrentContent().getPlainText());
    // const newContent = Modifier.insertText(
    //   state.getCurrentContent(),
    //   state.getSelection(),
    //   state.getCurrentContent().getPlainText()
    // );
    setState(state);
  };

  return (
    <Editor
      ref={editorRef}
      editorState={state}
      placeholder="Start a new message"
      onChange={handleChange}
      handleReturn={handleReturn}
    />
  );
};
