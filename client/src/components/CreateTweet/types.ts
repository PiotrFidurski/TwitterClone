import { EditorState } from "draft-js";
import { FormikState } from "formik/dist/types";

export interface EditorProps {
  editorState: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

export interface IHandleSubmit {
  body: string;
  resetForm: (
    nextState?:
      | Partial<
          FormikState<{
            body: string;
          }>
        >
      | undefined
  ) => void;
}
