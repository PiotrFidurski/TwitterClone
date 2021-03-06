import * as React from "react";
import { Formik } from "formik";
import { EditorState, ContentState } from "draft-js";
import { Toolbar } from "./Toolbar";
import * as yup from "yup";
import {
  CreateTweetDocument,
  CreateTweetMutation,
} from "../../generated/graphql";
import { useHistory } from "react-router-dom";
import { Editor } from "./Editor";
import CompositeDecorator from "./CompositeDecorator";
import { StyledForm, BaseStylesDiv } from "../../styles";
import { useModal } from "../context/ModalContext";
import { useMutation } from "@apollo/client";
import { EmojiPicker } from "../TwemojiPicker/EmojiPicker";
import { DropdownProvider } from "../DropDown/context";
import { emojiPickerReducer } from "../DropDown/reducers";
import { StyledDropDownItem } from "../DropDown/DropDownComposition/styles";
import { IHandleSubmit } from "./types";

interface Props {
  tweetToReplyTo?: {
    conversationId: string | undefined;
    tweetId: string | undefined;
  };
}

export const Form: React.FC<Props> = ({ tweetToReplyTo }) => {
  const [createTweet] = useMutation<CreateTweetMutation>(CreateTweetDocument);
  const { closeModal } = useModal();
  const history = useHistory();

  const [state, setState] = React.useState(() =>
    EditorState.createEmpty(CompositeDecorator)
  );

  const handleSubmit = ({ body, resetForm }: IHandleSubmit) => {
    createTweet({
      variables: {
        inReplyToId: tweetToReplyTo && tweetToReplyTo!.tweetId!,
        conversationId: tweetToReplyTo && tweetToReplyTo!.conversationId!,
        body,
      },

      update: (cache, { data }) => {
        cache.modify({
          fields: {
            feed(existingFeed = [], { toReference }) {
              const newTweetRef = toReference(data!.createTweet!);

              return {
                ...existingFeed,
                edges: [newTweetRef, ...existingFeed.edges!],
              };
            },
            replies(existingReplies = [], { toReference }) {
              const newTweetRef = toReference(data!.createTweet!);

              return {
                ...existingReplies,
                edges: [newTweetRef, ...existingReplies.edges],
              };
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

    if (history.location.pathname === "/tweets/compose") {
      setTimeout(() => {
        closeModal();
      }, 50);
    }
  };

  return (
    <Formik
      initialValues={{ body: "" }}
      validationSchema={yup.object().shape({
        body: yup.string().required().max(280),
      })}
      onSubmit={({ body }, { resetForm }) => handleSubmit({ body, resetForm })}
    >
      {({ setFieldValue }) => {
        return (
          <StyledForm>
            <DropdownProvider reducer={emojiPickerReducer}>
              <Editor
                editorState={state}
                setState={setState}
                setFieldValue={setFieldValue}
              />

              <DropdownProvider.Menu position="absolute">
                <StyledDropDownItem noPadding>
                  <BaseStylesDiv>
                    <EmojiPicker
                      state={state}
                      setState={setState}
                      setFieldValue={setFieldValue}
                    />
                  </BaseStylesDiv>
                </StyledDropDownItem>
              </DropdownProvider.Menu>
              <Toolbar state={state} />
            </DropdownProvider>
          </StyledForm>
        );
      }}
    </Formik>
  );
};
