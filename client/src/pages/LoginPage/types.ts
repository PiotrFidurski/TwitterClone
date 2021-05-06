import { FormikErrors } from "formik/dist/types";
export interface IHandleSubmit {
  values: { email: string; password: string };
  setErrors: (
    errors: FormikErrors<{
      email: string | undefined;
      password: string | undefined;
      message: string;
      __typename: "UserLoginInvalidInputError";
    }>
  ) => void;
}

export interface Errors {
  email: string | undefined;
  password: string | undefined;
  message: string;
  __typename: "UserLoginInvalidInputError";
}
