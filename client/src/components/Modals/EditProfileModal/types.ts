import { FormikErrors } from "formik/dist/types";

export interface Errors {
  name: string | undefined;
  bio: string | undefined;
  website: string | undefined;
  message: string;
  __typename: "UserUpdateInvalidInputError";
}

export interface IHandleSubmit {
  values: { name: string; bio: string; website: string };
  setErrors: (
    errors: FormikErrors<{
      name: string | undefined;
      bio: string | undefined;
      website: string;
      __typename: "UserUpdateInvalidInputError";
    }>
  ) => void;
}
