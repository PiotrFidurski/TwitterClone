import * as React from "react";
import { Formik, FormikState } from "formik";
import { EditorState, ContentState } from "draft-js";
import { Toolbar } from "./Toolbar";
import * as yup from "yup";
import {
  CreatePostDocument,
  CreatePostMutation,
} from "../../generated/graphql";
import { useHistory } from "react-router-dom";
import { Editor } from "../Editor";
import CompositeDecorator from "./CompositeDecorator";
import { StyledForm } from "../../styles";
import { useModalContext } from "../context/ModalContext";
import { useMutation } from "@apollo/client";

const schema = yup.object().shape({
  body: yup.string().required().max(280),
});

interface IHandleSubmit {
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

interface Props {
  postToReplyTo?: {
    conversationId: string | undefined;
    postId: string | undefined;
  };
}

export const Form: React.FC<Props> = ({ postToReplyTo }) => {
  const [createPost] = useMutation<CreatePostMutation>(CreatePostDocument);
  const { closeModal } = useModalContext();
  const history = useHistory();

  const [state, setState] = React.useState(() =>
    EditorState.createEmpty(CompositeDecorator)
  );

  const handleSubmit = ({ body, resetForm }: IHandleSubmit) => {
    createPost({
      variables: {
        inReplyToId: postToReplyTo && postToReplyTo!.postId!,
        conversationId: postToReplyTo && postToReplyTo!.conversationId!,
        body,
      },

      update: (cache, { data }) => {
        cache.modify({
          fields: {
            feed(existingFeed = [], { toReference }) {
              const newPostRef = toReference(data!.createPost!.id);
              return (
                existingFeed &&
                existingFeed.feed && [newPostRef, ...existingFeed.feed!]
              );
            },
            replies(existingReplies = [], { toReference }) {
              const newPostRef = toReference(data!.createPost!.id);
              return [newPostRef, ...existingReplies];
            },
          },
        });
      },
    });

    resetForm();
    setState(
      EditorState.push(
        state,
        ContentState.createFromText(""),
        "delete-character"
      )
    );
    if (history.location.pathname === "/posts/compose") {
      setTimeout(() => {
        closeModal();
      }, 50);
    }
  };
  return (
    <Formik
      initialValues={{ body: "" }}
      validationSchema={schema}
      onSubmit={({ body }, { resetForm }) => handleSubmit({ body, resetForm })}
    >
      {({ setFieldValue }) => {
        return (
          <StyledForm>
            <Editor
              editorState={state}
              setState={setState}
              setFieldValue={setFieldValue}
            />
            <Toolbar state={state} />
          </StyledForm>
        );
      }}
    </Formik>
  );
};
