import { EditorState, Modifier } from "draft-js";

export function insertEmoji(emojiToInsert: string, editorState: EditorState) {
  const currentContent = editorState.getCurrentContent(),
    currentSelection = editorState.getSelection();

  const newContent = Modifier.insertText(
    currentContent,
    currentSelection,
    emojiToInsert
  );
  return EditorState.moveFocusToEnd(
    EditorState.push(editorState, newContent, "insert-characters")
  );
}
