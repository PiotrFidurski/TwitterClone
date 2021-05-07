import { EditorState } from "draft-js";

export type Emoji = { name: string; unicode: string; char: string };
export interface Props {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  state: EditorState;
}
