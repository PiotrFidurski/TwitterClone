import * as React from "react";
import { ButtonContainer, SpanContainer, StyledForm } from "../../styles";
import { TextFormField } from "../../components/FormComponents/TextFormField";
import { Formik, FormikErrors } from "formik";
import {
  AuthUserDocument,
  AuthUserQuery,
  RegisterDocument,
  LoginDocument,
  LoginMutation,
  RegisterMutation,
} from "../../generated/graphql";
import { setAccessToken } from "../../accessToken";
import { useMutation } from "@apollo/client";
import { IHandleSubmit, Errors } from "./types";
import { schema } from "./validationSchema";
import { authUserId } from "../../cache";

export const Form: React.FC = () => {
  const [login] = useMutation<LoginMutation>(LoginDocument);

  const [register] = useMutation<RegisterMutation>(RegisterDocument);

  const handleSubmit = async ({
    values: { name, username, email, password },
    setErrors,
  }: IHandleSubmit) => {
    await register({
      variables: { name, username, email, password },
      update(_, { data }) {
        if (data?.register.__typename === "UserRegisterInvalidInputError") {
          setErrors(data!.register as FormikErrors<Errors>);
        }
        if (data?.register.__typename === "UserRegisterSuccess") {
          login({
            variables: { email, password },
            update: (store, { data }) => {
              if (data?.login?.__typename === "UserLoginSuccess") {
                store.writeQuery<AuthUserQuery>({
                  query: AuthUserDocument,
                  data: {
                    authUser: data!.login!.node,
                  },
                });
                authUserId(data.login.node.id);
                setAccessToken(data!.login!.accessToken);
              }
            },
          });
        }
      },
    });
  };
  return (
    <Formik
      initialValues={{ name: "", username: "", email: "", password: "" }}
      onSubmit={async (values, { setErrors }) =>
        handleSubmit({ values, setErrors })
      }
      validationSchema={schema}
    >
      {() => (
        <StyledForm>
          <TextFormField name="name" label="Your name" />
          <TextFormField name="username" label="Username, e.g chimson" />
          <TextFormField name="email" label="Email" />
          <TextFormField name="password" label="Password" type="password" />
          <ButtonContainer type="submit" noMarginLeft filledVariant bigger>
            <SpanContainer bold>
              <span>Sign Up</span>
            </SpanContainer>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};
