import { FormikErrors } from "formik/dist/types";

export interface IHandleSubmit {
  values: { email: string; password: string; username: string; name: string };
  setErrors: (
    errors: FormikErrors<{
      name: string | undefined;
      username: string | undefined;
      email: string | undefined;
      password: string | undefined;
      message: string;
      __typename: "UserRegisterInvalidInputError";
    }>
  ) => void;
}

export interface Errors {
  name: string | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  message: string;
  __typename: "UserRegisterInvalidInputError";
}
