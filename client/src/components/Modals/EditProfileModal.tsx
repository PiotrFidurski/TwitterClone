import * as React from "react";
import { Modal } from "./ModalComposition/Modal";
import {
  UpdateUserDocument,
  UploadAvatarDocument,
  AuthUserDocument,
} from "../../generated/graphql";
import {
  BaseStylesDiv,
  HoverContainer,
  Absolute,
  SpanContainer,
  ButtonContainer,
  StyledForm,
  Spinner,
} from "../../styles";
import { ReactComponent as Close } from "../svgs/Close.svg";
import { HeaderContainer } from "../PostComposition/styles";
import { Background } from "../../pages/ProfilePage/Profile/styles";
import { TextFormField } from "../FormComponents/TextFormField";
import { Formik } from "formik";
import { UploadAvatar } from "../UploadAvatar";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";

interface Errors {
  name: string | undefined;
  bio: string | undefined;
  website: string | undefined;
  message: string;
  __typename: "UserUpdateInvalidInputError";
}

interface IHandleSubmit {
  values: { name: string; bio: string; website: string };
  setErrors: (errors: Errors) => void;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  bio: yup.string().nullable(),
  website: yup.lazy((value) =>
    !value
      ? yup.string()
      : yup
          .string()
          .matches(
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
            "Invalid url."
          )
          .nullable()
  ),
});

export const EditProfileModal: React.FC = () => {
  const [updateUser, { called, data: fieldData }] = useMutation(
    UpdateUserDocument
  );
  const [upload, { called: avatarCalled, data: avatarData }] = useMutation(
    UploadAvatarDocument
  );

  const history = useHistory();
  const { data, loading } = useQuery(AuthUserDocument);

  React.useEffect(() => {
    if (avatarCalled ? avatarData : fieldData) {
      history.goBack();
    }
  }, [loading, avatarData, fieldData, history, avatarCalled]);

  const handleSubmit = async ({
    values: { name, bio, website },
    setErrors,
  }: IHandleSubmit) => {
    const response = await updateUser({
      variables: {
        userId: data!.authUser!.id,
        name,
        bio,
        website,
      },
    });

    if (
      response.data!.updateUser!.__typename === "UserUpdateInvalidInputError"
    ) {
      setErrors(response!.data!.updateUser! as Errors);
    }
  };

  return (
    <>
      {!loading && (
        <>
          <Modal>
            {!!(avatarCalled ? avatarData || fieldData : fieldData) ? (
              <div
                style={{
                  position: "absolute",
                  zIndex: 9999,
                  width: "100%",
                  height: "100%",
                  backgroundColor: `rgb(139 145 150 / 40%)`,
                }}
              >
                <Spinner bigMargin />
              </div>
            ) : null}
            <Formik
              validationSchema={schema}
              initialValues={{
                name: data!.authUser!.name! || "",
                bio: data!.authUser!.bio || "",
                website: data!.authUser!.website || "",
              }}
              onSubmit={async (values, { setErrors }) =>
                handleSubmit({ values, setErrors })
              }
            >
              {({ errors }) => {
                return (
                  <StyledForm>
                    <Modal.Header>
                      {({ closeModal }) => {
                        return (
                          <BaseStylesDiv
                            style={{ flexGrow: 1, alignItems: "center" }}
                          >
                            <HoverContainer>
                              <Absolute onClick={closeModal} />
                              <Close />
                            </HoverContainer>
                            <HeaderContainer>
                              <SpanContainer bolder bigger marginLeft>
                                <span>Edit Profile</span>
                              </SpanContainer>
                              <ButtonContainer
                                disabled={
                                  !!(
                                    errors.bio ||
                                    errors.name ||
                                    errors.website
                                  )
                                }
                                type="submit"
                                style={{ flexGrow: 0 }}
                                filledVariant
                              >
                                <SpanContainer bold>
                                  <span>Save</span>
                                </SpanContainer>
                              </ButtonContainer>
                            </HeaderContainer>
                          </BaseStylesDiv>
                        );
                      }}
                    </Modal.Header>
                    <Modal.Content>
                      <Background />
                      <div style={{ padding: "0 15px 0 15px" }}>
                        <BaseStylesDiv flexColumn flexGrow>
                          <UploadAvatar
                            upload={upload}
                            user={data!.authUser}
                            saving={called}
                          />
                          <BaseStylesDiv
                            style={{ paddingTop: "10px" }}
                            flexColumn
                          >
                            <TextFormField name="name" label="Name" />
                            <TextFormField name="bio" label="Bio" />
                            <TextFormField name="website" label="Website" />
                          </BaseStylesDiv>
                        </BaseStylesDiv>
                      </div>
                    </Modal.Content>
                  </StyledForm>
                );
              }}
            </Formik>
          </Modal>
        </>
      )}
    </>
  );
};
