import * as React from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Link, useLocation, useParams } from "react-router-dom";
import { ReactComponent as SadFace } from "../../components/svgs/SadFace.svg";
import {
  User,
  SendMessageMutation,
  SendMessageDocument,
  AcceptInvitationDocument,
  AcceptInvitationMutation,
  ConversationMessagesQuery,
  ConversationMessagesDocument,
  Conversation,
} from "../../generated/graphql";
import {
  SpanContainer,
  BaseStyles,
  BaseStylesDiv,
  StyledForm,
  AvatarContainer,
  Spinner,
  StyledAvatar,
  ButtonContainer,
} from "../../styles";
import { format } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import Editor from "draft-js-plugins-editor";
import createEmojiMartPlugin from "draft-js-emoji-mart-plugin";
import styled, { css } from "styled-components";
import { Field, Formik } from "formik";
import { EditorState, DraftHandleValue, ContentState } from "draft-js";
import data from "emoji-mart/data/all.json";
import { DropdownProvider, useDropdownCtxt } from "../../components/DropDown";
import { moveUpAndLeftReducer } from "../../components/DropDown/reducers";
import { StyledDropDownItem } from "../../components/DropDown/DropDownComposition/Menu";
import { Header } from "../../components/Header";

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

const MessageContainer = styled.div<{ isItMyMsg: boolean; margin: boolean }>`
  ${BaseStyles};
  align-items: center;
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
  conversation: (conversationId: string) => Conversation;
}

export const Messages: React.FC<Props> = ({ user, conversation }) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const { data, loading, fetchMore } = useQuery<ConversationMessagesQuery>(
    ConversationMessagesDocument,
    {
      variables: {
        conversationId: conversationId,
        limit: 25,
      },
    }
  );

  const [accept] = useMutation<AcceptInvitationMutation>(
    AcceptInvitationDocument
  );

  const chatRef = React.useRef<any>(null);

  const [height, setHeight] = React.useState(window.innerHeight);

  const setHeightToWindowSize = () => {
    setHeight(window.innerHeight);
  };
  const loadMore = React.useCallback(async () => {
    if (data!.conversationMessages!.hasNextPage) {
      await fetchMore({
        variables: {
          limit: 10,
          cursorId: data!.conversationMessages!.messages!.length
            ? data!.conversationMessages!.messages![0].id
            : "",
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prev;

          return {
            ...prev,
            conversationMessages: {
              ...prev.conversationMessages,
              messages: [
                ...fetchMoreResult!.conversationMessages!.messages,
                ...prev.conversationMessages.messages,
              ],
            },
          };
        },
      });
    }
  }, [data, fetchMore]);

  React.useEffect(() => {
    if (chatRef && chatRef.current) {
      // const scroll =
      //   chatRef.current.scrollHeight - chatRef.current.clientHeight;
      // chatRef && (chatRef!.current!.scrollTo(0, scroll) as any);
    }
    window.addEventListener("resize", setHeightToWindowSize);
    return () => window.removeEventListener("resize", setHeightToWindowSize);
  });

  const isItMyLastMsg = (index: number) => {
    return data &&
      data!.conversationMessages!.messages!.length &&
      data!.conversationMessages!.messages![index + 1]
      ? data!.conversationMessages!.messages![index + 1].messagedata
          .senderId !==
          data!.conversationMessages!.messages![index].messagedata.senderId
      : data!.conversationMessages!.messages![0].id;
  };

  if (loading) return <Spinner />;

  const isItMyMessage = (message: { messagedata: { senderId: string } }) =>
    !!(user.id === message.messagedata.senderId);

  return (
    <>
      <Header justifyStart>
        {!loading &&
          data!.conversationMessages! &&
          data!
            .conversationMessages!.conversation!.participants!.filter(
              (member) => member.userId !== user.id
            )
            .map((_user) => (
              <BaseStylesDiv
                key={_user.userId}
                flexGrow
                style={{ alignItems: "center" }}
              >
                <Link
                  to={{
                    pathname: `/user/${
                      conversation!(conversationId)!.user.username
                    }`,
                  }}
                >
                  <AvatarContainer height="34px" width={34} noRightMargin>
                    <StyledAvatar
                      url={conversation!(conversationId)!.user.avatar}
                    />
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
                    <span>{conversation!(conversationId)!.user.username}</span>
                  </SpanContainer>
                  <BaseStylesDiv>
                    {/* <Link
                      to={{
                        pathname: "/messages/compose",
                        state: { isModalLoc: location },
                      }}
                    >
                      <ButtonContainer
                        noPadding
                        style={{
                          border: 0,
                          minHeight: "35px",
                          minWidth: "35px",
                        }}
                      >
                        <div>
                          <Settings
                            fill="var(--colors-button)"
                            width="1.20rem"
                            height="1.20rem"
                          />
                        </div>
                      </ButtonContainer>
                    </Link> */}
                  </BaseStylesDiv>
                </BaseStylesDiv>
              </BaseStylesDiv>
            ))}
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
            <MessageContainer
              key={message.id}
              margin={
                message.messagedata!.senderId !== user.id &&
                !isItMyLastMsg(index)
              }
              isItMyMsg={isItMyMessage(message)}
            >
              {conversation(conversationId).acceptedInvitation!.includes(
                user.id
              ) ? (
                <>
                  {message.messagedata!.senderId !== user.id &&
                  isItMyLastMsg(index) ? (
                    <Link
                      to={{
                        pathname: `/user/${
                          conversation!(conversationId)!.user.username
                        }`,
                      }}
                    >
                      <AvatarContainer
                        height="40px"
                        width={40}
                        style={{ marginBottom: "15px" }}
                      >
                        <StyledAvatar
                          url={conversation!(conversationId)!.user.avatar}
                        />
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
                            ? conversation!(conversationId)!.user.id !==
                              message.messagedata!.senderId
                              ? null
                              : conversation!(conversationId)!.user.username
                            : null}
                        </span>
                      </SpanContainer>

                      <>
                        {message!.messagedata!.senderId !== user.id ? (
                          <SpanContainer
                            grey
                            style={{ flexShrink: 0, padding: "0 5px 0 5px" }}
                          >
                            <span>·</span>
                          </SpanContainer>
                        ) : null}
                        {isItMyLastMsg(index) ? (
                          <SpanContainer grey smaller>
                            <span>
                              {format(
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
              ) : null}
            </MessageContainer>
          ))}
        </InfiniteScroll>
      </StyledContainer>
      {conversation(conversationId).acceptedInvitation!.includes(user!.id!) ? (
        <MessageForm user={user} />
      ) : (
        <BaseStylesDiv
          flexColumn
          style={{ position: "absolute", bottom: "20px", left: 0, right: 0 }}
        >
          <BaseStylesDiv>
            <BaseStylesDiv
              flexGrow
              style={{
                maxWidth: "90%",
                margin: "0 auto",
                height: "1px",
                backgroundColor: "var(--colors-border)",
              }}
            ></BaseStylesDiv>
          </BaseStylesDiv>
          <BaseStylesDiv flexColumn>
            <BaseStylesDiv
              style={{
                paddingTop: "20px",
                alignSelf: "center",
                maxWidth: "360px",
                margin: "0 auto",
              }}
            >
              <SpanContainer bigger bolder breakSpaces>
                <span>
                  {conversation!(conversationId).user!.username} wants to start
                  a conversation with you
                </span>
              </SpanContainer>
            </BaseStylesDiv>
            <BaseStylesDiv
              flexGrow
              style={{ padding: "20px 0", margin: "0 auto", width: "330px" }}
            >
              <ButtonContainer
                noMarginLeft
                style={{ minHeight: "40px" }}
                onClick={() => {
                  accept({
                    variables: {
                      conversationId: conversationId,
                    },
                  });
                }}
              >
                <div>
                  <SpanContainer>
                    <span>Accept</span>
                  </SpanContainer>
                </div>
              </ButtonContainer>
              <ButtonContainer
                warning
                filledVariant
                style={{ minHeight: "40px" }}
              >
                <div>
                  <SpanContainer>
                    <span>Reject</span>
                  </SpanContainer>
                </div>
              </ButtonContainer>
            </BaseStylesDiv>
          </BaseStylesDiv>
          <BaseStylesDiv>
            <BaseStylesDiv
              flexGrow
              style={{
                maxWidth: "90%",
                margin: "0 auto",
                height: "1px",
                backgroundColor: "var(--colors-border)",
              }}
            ></BaseStylesDiv>
          </BaseStylesDiv>
        </BaseStylesDiv>
      )}
    </>
  );
};

const MessageForm: React.FC<{ user: User }> = ({ user }) => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [sendMessage] = useMutation<SendMessageMutation>(SendMessageDocument);
  const [state, setState] = React.useState(() => EditorState.createEmpty());
  const { cache } = useApolloClient();
  return (
    <StyledFormArea>
      <Formik
        initialValues={{ text: "" }}
        onSubmit={async (values, { resetForm }) => {
          const arr = conversationId.split("-");

          await sendMessage({
            variables: {
              text: values.text,
              senderId: user.id,
              conversationId: conversationId,
              receiverId: arr[0] !== user.id ? arr[0] : arr[1],
            },
            update: (store, { data }) => {
              cache.modify({
                fields: {
                  userInbox(cachedEntries) {},
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

const ChatEditor: React.FC<any> = ({
  handleSubmission,
  state,
  setState,
  setFieldValue,
}) => {
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
};
