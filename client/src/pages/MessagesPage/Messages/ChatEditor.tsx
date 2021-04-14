import * as React from "react";
import Editor from "draft-js-plugins-editor";
import { EditorState, DraftHandleValue } from "draft-js";
import { useLocation } from "react-router-dom";
import { useDropdownCtxt } from "../../../components/DropDown";
import data from "emoji-mart/data/all.json";
import createEmojiMartPlugin from "draft-js-emoji-mart-plugin";

const emojiPlugin = createEmojiMartPlugin({
  data,
  set: "google",
});

export const ChatEditor: React.FC<any> = ({
  handleSubmission,
  state,
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
    if (editorRef && editorRef.current && !dropdownState.open) {
      editorRef!.current!.focus();
    }
  }, [dropdownState.open, dropdownState, location]);

  const handleChange = (state: EditorState) => {
    setFieldValue("text", state.getCurrentContent().getPlainText("\u0001"));

    setState(state);
  };

  return (
    <Editor
      ref={editorRef}
      plugins={[emojiPlugin]}
      editorState={state}
      placeholder="Start a new message"
      onChange={handleChange}
      handleReturn={handleReturn}
    />
  );
};
