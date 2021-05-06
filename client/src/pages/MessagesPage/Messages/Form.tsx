import * as React from "react";
import { useMutation } from "@apollo/client";
import { EditorState, ContentState } from "draft-js";
import { Formik } from "formik";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { DropdownProvider } from "../../../components/DropDown";
import { StyledDropDownItem } from "../../../components/DropDown/DropDownComposition/styles";
import { emojiPickerReducer } from "../../../components/DropDown/reducers";
import { ReactComponent as SadFace } from "../../../components/svgs/SadFace.svg";
import {
  User,
  Conversation,
  SendMessageMutation,
  SendMessageDocument,
  MessagesConnection,
  SendMessageSuccess,
} from "../../../generated/graphql";
import { StyledForm, BaseStylesDiv, BaseStyles } from "../../../styles";
import styled from "styled-components";
import { ChatEditor } from "./Editor";
import { EmojiPicker } from "../../../components/TwemojiPicker/EmojiPicker";
import { EmojiDecorator } from "./EmojiDecorator";

const StyledFormArea = styled.div`
  ${BaseStyles};
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 10px 10px 5px 10px;
  border-top: 1px solid var(--colors-border);
  background-color: var(--colors-mainbackground);
`;

const ChatBox = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  border-top: 1px solid var(--colors-border);
  border: 1px solid var(--colors-button);
  border-radius: 15px;
  background-color: var(--colors-thirdbackground);
  align-items: flex-end;
  justify-content: space-between;
  ::hover {
    cursor: text;
  }
  &:focus {
    background-color: var(--colors-mainbackground);
  }
`;

const StyledEditorContainer = styled.div`
  ${BaseStyles};
  z-index: 0;
  display: flex;
  flex-grow: 1;
  padding: 5.5px;
  flex-direction: column;
  width: 0px;
  color: var(--colors-maintext);
  margin: 0px 10px;
  line-height: 1.3125;
  height: 100%;
  font-size: 15px;
  max-height: 125px;
  overflow-y: auto;
  overflow-wrap: break-word;
`;

const StyledEmojiPickerContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 32px;
  height: 32px;
  justify-content: center;
  :hover {
    cursor: pointer;
    border-radius: 9999px;
    background-color: var(--colors-button-hover-opacity);
  }
`;

export const Form: React.FC<{
  user: User;
  conversation: Conversation;
  connection: MessagesConnection;
}> = ({ user, conversation }) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const [sendMessage] = useMutation<SendMessageMutation>(SendMessageDocument);
  const [state, setState] = React.useState(() =>
    EditorState.createEmpty(EmojiDecorator)
  );

  return (
    <StyledFormArea>
      <Formik
        initialValues={{ text: "" }}
        onSubmit={async (values, { resetForm }) => {
          const arr = conversationId.split("-");
          let tempId = `${v4()}sending...`;
          sendMessage({
            variables: {
              text: values.text,
              senderId: user.id,
              conversationId: conversationId,
              receiverId: arr[0] !== user.id ? arr[0] : arr[1],
            },
            optimisticResponse: {
              __typename: "Mutation",
              sendMessage: {
                __typename: "SendMessageSuccess",
                newmessage: {
                  __typename: "MessageEdge",
                  cursor: tempId,
                  node: {
                    __typename: "Message",
                    conversationId: conversationId,
                    id: tempId,
                    messagedata: {
                      __typename: "MessageData",
                      conversationId: conversationId,
                      senderId: user.id,
                      receiverId: arr[0] !== user.id ? arr[0] : arr[1],
                      text: values.text,
                      id: conversationId,
                    },
                  },
                },
                conversation: {
                  ...conversation,
                },
              },
            } as SendMessageMutation,
            update: (cache, { data }) => {
              const sendMessageSuccess = data?.sendMessage as SendMessageSuccess;
              cache.modify({
                fields: {
                  userInbox(
                    cachedEntries = {
                      __typename: "UserinboxResult",
                      conversations: [],
                      users: [],
                    },
                    { toReference, readField }
                  ) {
                    return {
                      ...cachedEntries,
                      __typename: "UserInboxResult",
                      lastSeenMessageId: sendMessageSuccess.newmessage!.node
                        .id!,
                      conversations: [...cachedEntries!.conversations!].filter(
                        (conversationRef: any) => {
                          if (conversationRef!.__ref === conversation.id) {
                            const ref = toReference(conversationRef);
                            const newMessageRef = toReference(
                              sendMessageSuccess.newmessage!.node
                            );
                            const messages_conversation: any = readField(
                              "messages_conversation",
                              ref
                            );
                            return {
                              ...conversationRef,
                              messages_conversation: [
                                ...messages_conversation!,
                              ].splice(0, 0, newMessageRef),
                              mostRecentEntryId: sendMessageSuccess.newmessage!
                                .node.id!,
                            };
                          }
                          return conversationRef;
                        }
                      ),
                    };
                  },
                  messages(cachedEntries, { readField, toReference }) {
                    const ref = toReference(cachedEntries.conversation);
                    const conversationId = readField("conversationId", ref);
                    if (
                      conversationId !==
                      sendMessageSuccess.newmessage!.node.conversationId
                    ) {
                      return cachedEntries;
                    }
                    const newRef = toReference(
                      sendMessageSuccess.newmessage.node
                    );
                    return {
                      ...cachedEntries,
                      edges: [
                        ...cachedEntries.edges,
                        {
                          cursor: sendMessageSuccess.newmessage!.node!.id!,
                          node: newRef,
                        },
                      ],
                    };
                  },
                },
              });
            },
          });

          resetForm();
          setState(
            EditorState.moveFocusToEnd(
              EditorState.push(
                state,
                ContentState.createFromText(""),
                "remove-range"
              )
            )
          );
        }}
      >
        {({ setFieldValue, handleSubmit }) => {
          return (
            <StyledForm
              style={{ flexDirection: "row" }}
              onSubmit={handleSubmit}
            >
              <ChatBox>
                <DropdownProvider
                  position="absolute"
                  reducer={emojiPickerReducer}
                >
                  <StyledEditorContainer>
                    <ChatEditor
                      handleSubmission={handleSubmit}
                      state={state}
                      setFieldValue={setFieldValue}
                      setState={setState}
                    />
                  </StyledEditorContainer>

                  <DropdownProvider.Toggle>
                    <StyledEmojiPickerContainer>
                      <BaseStylesDiv
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <SadFace
                          height="1.4em"
                          width="1.4em"
                          fill="var(--colors-button)"
                        />
                      </BaseStylesDiv>
                    </StyledEmojiPickerContainer>
                  </DropdownProvider.Toggle>
                  <DropdownProvider.Menu>
                    <StyledDropDownItem noPadding>
                      <EmojiPicker
                        setState={setState}
                        state={state}
                        setFieldValue={setFieldValue}
                      />
                    </StyledDropDownItem>
                  </DropdownProvider.Menu>
                </DropdownProvider>
              </ChatBox>
              {/* <button type="submit">submit</button> */}
              {/* disabled if input value.length = 0 */}
            </StyledForm>
          );
        }}
      </Formik>
    </StyledFormArea>
  );
};
