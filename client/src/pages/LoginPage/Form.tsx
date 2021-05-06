import * as React from "react";
import { ButtonContainer, SpanContainer, StyledForm } from "../../styles";
import { TextFormField } from "../../components/FormComponents/TextFormField";
import { Formik, FormikErrors } from "formik";
import {
  AuthUserQuery,
  AuthUserDocument,
  LoginDocument,
  LoginMutation,
} from "../../generated/graphql";
import { setAccessToken } from "../../accessToken";
import { useMutation } from "@apollo/client";
import { schema } from "./validationSchema";
import { IHandleSubmit, Errors } from "./types";
import { authUserId } from "../../cache";

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
          setErrors(data!.login! as FormikErrors<Errors>);
        }
        if (data?.login?.__typename === "UserLoginSuccess") {
          cache.writeQuery<AuthUserQuery>({
            query: AuthUserDocument,
            data: { authUser: data.login.node },
          });
          authUserId(data.login.node.id);
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
