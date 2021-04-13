import * as React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ReactComponent as SadFace } from "../../../components/svgs/SadFace.svg";
import { ReactComponent as LeaveConversation } from "../../../components/svgs/leaveConversation.svg";
import { ReactComponent as Caret } from "../../../components/svgs/Caret.svg";
import { ReactComponent as Mute } from "../../../components/svgs/mute.svg";
import { ReactComponent as Block } from "../../../components/svgs/block.svg";
import { v4 } from "uuid";
import {
  User,
  SendMessageMutation,
  SendMessageDocument,
  ConversationMessagesQuery,
  ConversationMessagesDocument,
  LeaveConversationDocument,
  LeaveConversationMutation,
  LeftAtQuery,
  LeftAtDocument,
  Conversation,
} from "../../../generated/graphql";
import {
  SpanContainer,
  BaseStyles,
  BaseStylesDiv,
  StyledForm,
  AvatarContainer,
  Spinner,
  StyledAvatar,
  ButtonContainer,
  JustifyCenter,
} from "../../../styles";
import { format } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import Editor from "draft-js-plugins-editor";
import createEmojiMartPlugin from "draft-js-emoji-mart-plugin";
import styled, { css } from "styled-components";
import { Field, Formik } from "formik";
import { EditorState, DraftHandleValue, ContentState } from "draft-js";
import data from "emoji-mart/data/all.json";
import {
  DropdownProvider,
  useDropdownCtxt,
} from "../../../components/DropDown";
import {
  moveLeftReducer,
  moveUpAndLeftReducer,
} from "../../../components/DropDown/reducers";
import { StyledDropDownItem } from "../../../components/DropDown/DropDownComposition/Menu";
import { Header } from "../../../components/Header";
import { useModalContext } from "../../../components/context/ModalContext";

const emojiPlugin = createEmojiMartPlugin({
  data,
  set: "google",
});

const { Picker } = emojiPlugin;

const StyledContainer = styled.div<{ height: number }>`
  ${BaseStyles};
  padding: 10px;
  flex-direction: column;
  overflow: auto;
  flex-direction: column-reverse;
  min-height: ${(props) => props.height - 109}px;
  max-height: ${(props) => props.height - 109}px;
  height: 700px;
  width: auto;
`;

export const InputContainer = styled(Field)`
  ${BaseStyles};
  border-width: 0px;
  display: none;
  border-style: inset;
  width: 100%;
  background-color: var(--colors-thirdbackground);
  outline: none;
  padding: 2px 10px 5px 10px;
  color: var(--colors-maintext);
  font-size: 19px;
`;

const MessageContainer = styled.div<{
  isItMyMsg: boolean;
  margin: boolean;
  isItMyLastMsg: boolean;
}>`
  ${BaseStyles};
  align-items: center;
  margin-bottom: ${(props) => (props.isItMyLastMsg ? "10px" : "0")};
  margin-left: ${(props) => (props.margin ? "50px" : "0")};
  justify-content: ${(props) => (props.isItMyMsg ? "flex-end" : "flex-start")};
`;

const MessageWrapper = styled.div<{ isItMyMsg: boolean }>`
  ${BaseStyles};
  flex-direction: column;
  max-width: 80%;
  width: 100%;
  align-items: ${(props) => (props.isItMyMsg ? "flex-end" : "flex-start")};
`;

const StyledMessage = styled.div<{ isItMyMsg: boolean }>`
  ${({ isItMyMsg }) => css`
    ${BaseStyles};
    max-width: 85%;
    border: 1px solid
      ${isItMyMsg ? "var(--colors-button)" : "var(--colors-thirdbackground)"};
    border-radius: 16px;
    background-color: ${isItMyMsg
      ? "var(--colors-button)"
      : "var(--colors-thirdbackground)"};
    border-bottom-left-radius: ${isItMyMsg ? "16px" : "0px"};
    border-bottom-right-radius: ${isItMyMsg ? "0px" : "16px"};
    padding: 10px;
    margin: 5px;
    ${SpanContainer} {
      > span {
        color: ${isItMyMsg ? "white !important" : "var(--colors-maintext)"};
      }
    }
  `}
`;

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

interface Props {
  user: User;
  getReceiver: (conversationId: string) => User;
}

export const Messages: React.FC<Props> = ({ user, getReceiver }) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const chatRef = React.useRef<any>(null);

  const receiver = getReceiver(conversationId);

  const [height, setHeight] = React.useState(window.innerHeight);

  const { openModal } = useModalContext();

  const history = useHistory();

  const [leaveConversation] = useMutation<LeaveConversationMutation>(
    LeaveConversationDocument,
    { variables: { conversationId: conversationId } }
  );

  const { data: leftAtData } = useQuery<LeftAtQuery>(LeftAtDocument, {
    variables: { userId: user!.id!, conversationId: conversationId },
  });

  const { data, loading, fetchMore } = useQuery<ConversationMessagesQuery>(
    ConversationMessagesDocument,
    {
      variables: {
        leftAtMessageId:
          leftAtData! && leftAtData!.leftAt! !== null
            ? leftAtData!.leftAt!.leftAtMessageId!
            : "",
        conversationId: conversationId,
        limit: 25,
      },
    }
  );

  const handleLeaveConversation = () => {
    leaveConversation({
      update: (cache, { data: _data }) => {
        cache.modify({
          fields: {
            userInbox(cachedEntries) {
              return cachedEntries!.conversations!.filter(
                (conversation: any) => {
                  if (conversation!.__ref === _data!.leaveConversation!.id) {
                    return {
                      ...conversation,
                      participants: _data!.leaveConversation!.participants,
                    };
                  }
                  return conversation;
                }
              );
            },
            leftAt(
              cachedEntry = {
                __typename: "LeftConversationAt",
                userId: "",
                conversationId: "",
                leftAtMessageId: "",
              }
            ) {
              return {
                ...cachedEntry,
                leftAtMessageId: data!.conversationMessages!.messages!.length
                  ? data!.conversationMessages!.messages![
                      data!.conversationMessages!.messages!.length - 1
                    ].id
                  : "",
              };
            },
          },
        });
        history.push("/messages");
      },
    });
  };

  const loadMore = React.useCallback(async (): Promise<any> => {
    if (data!.conversationMessages!.hasNextPage) {
      await fetchMore({
        variables: {
          limit: 10,
          cursorId: data!.conversationMessages!.messages!.length
            ? data!.conversationMessages!.messages![0].id
            : "",
        },
      });
    }
  }, [data, fetchMore]);

  React.useEffect(() => {
    const setHeightToWindowSize = () => setHeight(window.innerHeight);

    window.addEventListener("resize", setHeightToWindowSize);
    return () => window.removeEventListener("resize", setHeightToWindowSize);
  }, []);

  if (loading && !data) return <Spinner />;

  return receiver === undefined ? (
    <BaseStylesDiv flexGrow flexColumn style={{ paddingTop: "50%" }}>
      <JustifyCenter>
        <SpanContainer bolder bigger textCenter breakSpaces>
          <span>
            You don’t have a message selected Choose one from your existing
            messages, or start a new one.
          </span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : (
    <>
      <Header justifyStart>
        <BaseStylesDiv flexGrow style={{ alignItems: "center" }}>
          <Link
            to={{
              pathname: `/user/${receiver.username}`,
            }}
          >
            <AvatarContainer height="34px" width={34} noRightMargin>
              <StyledAvatar url={receiver.avatar} />
            </AvatarContainer>
          </Link>

          <BaseStylesDiv
            flexGrow
            style={{
              margin: "0px 0px 0px 10px",
              width: "0px",
              textOverflow: "ellipsis",
              justifyContent: "space-between",
            }}
          >
            <SpanContainer bold biggest>
              <span>{receiver.username}</span>
            </SpanContainer>
            <DropdownProvider position="absolute" reducer={moveLeftReducer}>
              <DropdownProvider.Toggle>
                <ButtonContainer
                  noPadding
                  style={{
                    border: 0,
                    minHeight: "35px",
                    minWidth: "35px",
                  }}
                >
                  <div>
                    <Caret
                      fill="var(--colors-button)"
                      width="1.20rem"
                      height="1.20rem"
                    />
                  </div>
                </ButtonContainer>
              </DropdownProvider.Toggle>
              <DropdownProvider.Menu>
                <BaseStylesDiv flexColumn>
                  <StyledDropDownItem
                    danger
                    onClick={() => {
                      openModal("leaveConversationAlert", {
                        leaveConversation: handleLeaveConversation,
                      });
                    }}
                  >
                    <LeaveConversation />
                    <SpanContainer>
                      <span>Leave Conversation</span>
                    </SpanContainer>
                  </StyledDropDownItem>
                  <StyledDropDownItem>
                    <Mute />
                    <SpanContainer>
                      <span>Mute notifications</span>
                    </SpanContainer>
                  </StyledDropDownItem>
                  <StyledDropDownItem>
                    <Block />
                    <SpanContainer>
                      <span>Block @{receiver.username}</span>
                    </SpanContainer>
                  </StyledDropDownItem>
                </BaseStylesDiv>
              </DropdownProvider.Menu>
            </DropdownProvider>
          </BaseStylesDiv>
        </BaseStylesDiv>
      </Header>

      <StyledContainer height={height} ref={chatRef} id="scrollableDiv">
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          inverse={true}
          loader={null}
          dataLength={data!.conversationMessages!.messages!.length}
          next={loadMore}
          hasMore={data!.conversationMessages!.hasNextPage}
        >
          {data!.conversationMessages!.messages!.map((message, index) => (
            <Message
              index={index}
              message={message}
              key={message.id}
              messages={data!.conversationMessages!.messages!}
              receiver={receiver}
              user={user}
            />
            // <MessageContainer
            //   key={message.id}
            //   isItMyLastMsg={isItMyLastMsg(index)}
            //   margin={
            //     message.messagedata!.senderId !== user.id &&
            //     !isItMyLastMsg(index)
            //   }
            //   isItMyMsg={isItMyMessage(message)}
            // >
            //   <>
            //     {message.messagedata!.senderId !== user.id &&
            //     isItMyLastMsg(index) ? (
            //       <Link
            //         to={{
            //           pathname: `/user/${receiver.username}`,
            //         }}
            //       >
            //         <AvatarContainer
            //           height="40px"
            //           width={40}
            //           style={{ marginBottom: "15px" }}
            //         >
            //           <StyledAvatar url={receiver.avatar} />
            //         </AvatarContainer>
            //       </Link>
            //     ) : null}
            //     <MessageWrapper isItMyMsg={isItMyMessage(message)}>
            //       <StyledMessage isItMyMsg={isItMyMessage(message)}>
            //         <SpanContainer breakSpaces>
            //           <span>{message.messagedata.text}</span>
            //         </SpanContainer>
            //       </StyledMessage>

            //       <BaseStylesDiv>
            //         <SpanContainer smaller grey style={{ marginLeft: "5px" }}>
            //           <span>
            //             {isItMyLastMsg(index)
            //               ? receiver.id !== message.messagedata!.senderId
            //                 ? null
            //                 : __user.username
            //               : null}
            //           </span>
            //         </SpanContainer>

            //         <>
            //           {message!.messagedata!.senderId !== user.id &&
            //           isItMyLastMsg(index) ? (
            //             <SpanContainer
            //               grey
            //               style={{
            //                 flexShrink: 0,
            //                 padding: "0 5px 0 5px",
            //               }}
            //             >
            //               <span>·</span>
            //             </SpanContainer>
            //           ) : null}
            //           {isItMyLastMsg(index) ? (
            //             <SpanContainer grey smaller>
            //               <span>
            //                 {format(
            //                   new Date(
            //                     parseInt(
            //                       message!.id.toString().substring(0, 8),
            //                       16
            //                     ) * 1000
            //                   ),
            //                   "MMM dd, yyyy, hh:mm aaa",
            //                   {}
            //                 )}
            //               </span>
            //             </SpanContainer>
            //           ) : null}
            //         </>
            //       </BaseStylesDiv>
            //     </MessageWrapper>
            //   </>
            // </MessageContainer>
          ))}
        </InfiniteScroll>
      </StyledContainer>
      <MessageForm
        user={user}
        conversation={data!.conversationMessages!.conversation!}
      />
    </>
  );
};

const Message: React.FC<{
  message: any;
  messages: any;
  index: number;
  receiver: User;
  user: any;
}> = ({ message, index, receiver, user, messages }) => {
  const isItMyLastMsg = (index: number) => {
    return !!(messages!.length && messages![index + 1]
      ? messages![index + 1].messagedata.senderId !==
        messages![index].messagedata.senderId
      : messages![index].id);
  };

  const isItMyMessage = (message: { messagedata: { senderId: string } }) =>
    !!(user.id === message.messagedata.senderId);
  return (
    <MessageContainer
      key={message.id}
      isItMyLastMsg={isItMyLastMsg(index)}
      margin={
        message.messagedata!.senderId !== user.id && !isItMyLastMsg(index)
      }
      isItMyMsg={isItMyMessage(message)}
    >
      <>
        {message.messagedata!.senderId !== user.id && isItMyLastMsg(index) ? (
          <Link
            to={{
              pathname: `/user/${receiver.username}`,
            }}
          >
            <AvatarContainer
              height="40px"
              width={40}
              style={{ marginBottom: "15px" }}
            >
              <StyledAvatar url={receiver.avatar} />
            </AvatarContainer>
          </Link>
        ) : null}
        <MessageWrapper isItMyMsg={isItMyMessage(message)}>
          <StyledMessage isItMyMsg={isItMyMessage(message)}>
            <SpanContainer breakSpaces>
              <span>{message.messagedata.text}</span>
            </SpanContainer>
          </StyledMessage>

          <BaseStylesDiv>
            <SpanContainer smaller grey style={{ marginLeft: "5px" }}>
              <span>
                {isItMyLastMsg(index)
                  ? receiver.id !== message.messagedata!.senderId
                    ? null
                    : receiver.username
                  : null}
              </span>
            </SpanContainer>

            <>
              {message!.messagedata!.senderId !== user.id &&
              isItMyLastMsg(index) ? (
                <SpanContainer
                  grey
                  style={{
                    flexShrink: 0,
                    padding: "0 5px 0 5px",
                  }}
                >
                  <span>·</span>
                </SpanContainer>
              ) : null}
              {isItMyLastMsg(index) ? (
                <SpanContainer grey smaller>
                  <span>
                    {message.id.endsWith("sending...")
                      ? "Sending..."
                      : format(
                          new Date(
                            parseInt(
                              message!.id.toString().substring(0, 8),
                              16
                            ) * 1000
                          ),
                          "MMM dd, yyyy, hh:mm aaa",
                          {}
                        )}
                  </span>
                </SpanContainer>
              ) : null}
            </>
          </BaseStylesDiv>
        </MessageWrapper>
      </>
    </MessageContainer>
  );
};

const MessageForm: React.FC<{ user: User; conversation: Conversation }> = ({
  user,
  conversation,
}) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const [sendMessage] = useMutation<SendMessageMutation>(SendMessageDocument);
  const [state, setState] = React.useState(() => EditorState.createEmpty());

  return (
    <StyledFormArea>
      <Formik
        initialValues={{ text: "" }}
        onSubmit={async (values, { resetForm }) => {
          const arr = conversationId.split("-");

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
                __typename: "SendMessageResult",
                message: {
                  __typename: "Message",
                  conversationId: conversationId,
                  id: `${v4()}sending...`,
                  messagedata: {
                    __typename: "MessageData",
                    conversationId: conversationId,
                    senderId: user.id,
                    receiverId: "aa",
                    text: values.text,
                    id: conversationId,
                  },
                },
                conversation: {
                  ...conversation,
                },
              },
            } as SendMessageMutation,
            update: (cache, { data }) => {
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
                      lastSeenMessageId: data!.sendMessage!.message!.id!,

                      conversations: [...cachedEntries!.conversations!].filter(
                        (conversationRef: any) => {
                          if (conversationRef!.__ref === conversation.id) {
                            const ref = toReference(conversationRef);
                            console.log(conversationRef);
                            const newMessageRef = toReference(
                              data!.sendMessage!.message!.id
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
                              mostRecentEntryId: data!.sendMessage!.message!
                                .id!,
                            };
                          }

                          return conversationRef;
                        }
                      ),
                    };
                  },
                  conversationMessages(
                    cachedEntries,
                    { readField, toReference }
                  ) {
                    const ref = toReference(cachedEntries.conversation);
                    const conversationId = readField("conversationId", ref);
                    if (
                      conversationId !==
                      data!.sendMessage!.message!.conversationId
                    ) {
                      return cachedEntries;
                    }
                    return {
                      ...cachedEntries,
                      messages: [
                        ...cachedEntries.messages,
                        data!.sendMessage!.message!,
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
                  reducer={moveUpAndLeftReducer}
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
                    <StyledDropDownItem>
                      <Picker
                        theme="auto"
                        style={{
                          backgroundColor: "var(--colors-background)",
                        }}
                        perLine={7}
                        color="var(--colors-button)"
                        showPreview={false}
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

const ChatEditor: React.FC<any> = React.memo(
  ({ handleSubmission, state, setState, setFieldValue }) => {
    const editorRef = React.useRef<Editor | null>(null);

    const { state: dropdownState } = useDropdownCtxt();
    const location = useLocation();
    const handleReturn = (e: React.KeyboardEvent, state: EditorState) => {
      const handled: DraftHandleValue = "handled";
      const notHandled: DraftHandleValue = "not-handled";
      if (e.shiftKey) return notHandled;

      if (
        e.key === "Enter" &&
        state.getCurrentContent().getPlainText().length >= 1
      ) {
        handleSubmission();
        return handled;
      }
      return handled;
    };

    React.useEffect(() => {
      if (editorRef && editorRef.current && !dropdownState.open) {
        editorRef!.current!.focus();
      }
    }, [dropdownState.open, dropdownState, location]);

    const handleChange = (state: EditorState) => {
      setFieldValue("text", state.getCurrentContent().getPlainText());

      setState(state);
    };

    return (
      <Editor
        ref={editorRef}
        plugins={[emojiPlugin]}
        editorState={state}
        placeholder="Start a new message"
        onChange={handleChange}
        handleReturn={handleReturn}
      />
    );
  },
  (prevProps, nextProps) => prevProps.state === nextProps.state
);
