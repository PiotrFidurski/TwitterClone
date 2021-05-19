import * as React from "react";
import { EditorState, DraftHandleValue } from "draft-js";
import { useLocation } from "react-router-dom";
import { useDropdown } from "../../../components/DropDown/context";
import { Editor } from "draft-js";

export const ChatEditor: React.FC<any> = ({
  handleSubmission,
  state,
  setState,
  setFieldValue,
}) => {
  const editorRef = React.useRef<Editor | null>(null);

  const { state: dropdownState } = useDropdown();
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
