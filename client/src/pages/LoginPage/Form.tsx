import * as React from "react";
import { ButtonContainer, SpanContainer, StyledForm } from "../../styles";
import { TextFormField } from "../../components/FormComponents/TextFormField";
import { Formik, FormikErrors } from "formik";
import * as yup from "yup";
import {
  AuthUserQuery,
  AuthUserDocument,
  LoginDocument,
  LoginMutation,
} from "../../generated/graphql";
import { setAccessToken } from "../../accessToken";
import { useMutation } from "@apollo/client";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

interface IHandleSubmit {
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

export const Form: React.FC = () => {
  const [login] = useMutation<LoginMutation>(LoginDocument);

  const handleSubmit = async ({
    values: { email, password },
    setErrors,
  }: IHandleSubmit) => {
    await login({
      variables: { email, password },
      update(cache, { data }) {
        if (data?.login?.__typename === "UserLoginInvalidInputError") {
          setErrors(
            data!.login! as FormikErrors<{
              email: string | undefined;
              password: string | undefined;
              message: string;
              __typename: "UserLoginInvalidInputError";
            }>
          );
        }
        if (data?.login?.__typename === "UserLoginSuccess") {
          cache.writeQuery<AuthUserQuery>({
            query: AuthUserDocument,
            data: { authUser: data.login.node },
          });
          setAccessToken(data.login.accessToken);
        }
      },
    });
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values, { setErrors }) =>
        handleSubmit({ values, setErrors })
      }
      validationSchema={schema}
    >
      {() => (
        <StyledForm>
          <TextFormField name="email" label="email" />
          <TextFormField name="password" label="Password" type="password" />
          <ButtonContainer type="submit" noMarginLeft filledVariant bigger>
            <SpanContainer bold>
              <span>Log in</span>
            </SpanContainer>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};
