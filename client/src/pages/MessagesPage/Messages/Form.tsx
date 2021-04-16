import * as React from "react";
import { useMutation } from "@apollo/client";
import {
  EditorState,
  ContentState,
  convertToRaw,
  Modifier,
  Editor,
} from "draft-js";
import { Picker } from "emoji-mart";
import { Formik } from "formik";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { DropdownProvider } from "../../../components/DropDown";
import { StyledDropDownItem } from "../../../components/DropDown/DropDownComposition/Menu";
import { moveUpAndLeftReducer } from "../../../components/DropDown/reducers";
import { ReactComponent as SadFace } from "../../../components/svgs/SadFace.svg";
import {
  User,
  Conversation,
  SendMessageMutation,
  SendMessageDocument,
} from "../../../generated/graphql";
import {
  StyledForm,
  BaseStylesDiv,
  BaseStyles,
  HoverContainer,
  Absolute,
  SpanContainer,
} from "../../../styles";
import styled from "styled-components";
import { ChatEditor } from "./ChatEditor";
import { emojidata } from "../emojidata";
import json from "../../../components/assets/emoji/emojis.json";
import CompositeDecorator, {
  emojiDecorator,
} from "../../../components/CreatePost/CompositeDecorator";
import { TextFormField } from "../../../components/FormComponents/TextFormField";

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

export const Form: React.FC<{ user: User; conversation: Conversation }> = ({
  user,
  conversation,
}) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const [sendMessage] = useMutation<SendMessageMutation>(SendMessageDocument);
  const [state, setState] = React.useState(() =>
    EditorState.createEmpty(emojiDecorator)
  );
  // console.log(convertToRaw(state.getCurrentContent()).entityMap);
  // console.log(convertToRaw(state.getCurrentContent()).blocks);
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
                    <StyledDropDownItem noPadding>
                      <TwitchEmojiPicker
                        setFieldValue={setFieldValue}
                        setState={setState}
                        state={state}
                      />
                      {/* <Picker
                        theme="auto"
                        style={{
                          backgroundColor: "var(--colors-background)",
                        }}
                        perLine={7}
                        color="var(--colors-button)"
                        showPreview={false}
                      /> */}
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

const StyledBody = styled.div`
  max-height: 300px;
  ${BaseStyles};

  padding: 10px 15px;
  flex-wrap: wrap;
`;

const StyledPanelButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition: all 0.2s;
`;

const StyledContainer = styled.div`
  ${BaseStylesDiv};
  flex-direction: column;
  flex-grow: 1;
`;

function insertCharacter(characterToInsert: any, editorState: EditorState) {
  const currentContent = editorState.getCurrentContent(),
    currentSelection = editorState.getSelection();

  const newContent = Modifier.insertText(
    currentContent,
    currentSelection,
    characterToInsert
  );
  return EditorState.push(editorState, newContent, "insert-characters");
}

let allEmojis: Array<{
  name: string;
  unicode: string;
  char: string;
}> = [];

json.forEach((e) => (allEmojis = [...allEmojis, ...e.emojis]));

const TwitchEmojiPicker: React.FC<{
  setFieldValue: any;
  setState: any;
  state: EditorState;
}> = ({ setState, state }) => {
  const [categoryIdx, setCurrentCategory] = React.useState(0);
  const [searchEmoji, setSearchEmoji] = React.useState("");
  const onEmojiSelect = (emoji: any) => {
    const newState = insertCharacter(emoji.char, state);

    setState(
      EditorState.push(state, newState.getCurrentContent(), "insert-characters")
    );

    // setFieldValue("text", state.getCurrentContent().getPlainText("\u0001"));
  };

  const foundEmojis = React.useMemo(() => {
    if (!searchEmoji.length) {
      return null;
    }
    return allEmojis!
      .filter((e) => {
        if (e.name.toLowerCase().includes(searchEmoji.toLowerCase())) {
          return true;
        }
        return false;
      })
      .slice(0, 50);
  }, [searchEmoji]);

  function createEmoji(unicode: string, title: string) {
    return (
      <svg width="20" height="20">
        <use href={`/sprite.svg#${unicode}`}>
          <title>{title}</title>
        </use>
      </svg>
    );
  }

  function createCategories() {
    return json.map((item, index) => (
      <BaseStylesDiv
        key={index}
        flexGrow
        style={
          categoryIdx === index
            ? {
                justifyContent: "space-between",
                width: "32px",
                height: "32px",
                borderBottom: "2.5px solid var(--colors-button)",
              }
            : { justifyContent: "space-between", width: "32px", height: "32px" }
        }
      >
        <HoverContainer stretch>
          <Absolute
            noMargin
            style={{ borderRadius: "4px" }}
            onClick={() => setCurrentCategory(index)}
          />
          {createEmoji(item.unicode, item.name)}
        </HoverContainer>
      </BaseStylesDiv>
    ));
  }

  function createEmojis(index: number) {
    return foundEmojis! && foundEmojis!.length > 0
      ? foundEmojis!.map((item, index) => (
          <StyledPanelButton
            key={index}
            onClick={(e: any) => onEmojiSelect(item)}
          >
            <BaseStylesDiv style={{ width: "29px", height: "29px" }}>
              <HoverContainer stretch>
                <Absolute noMargin style={{ borderRadius: "4px" }} />
                {createEmoji(item.unicode, item.name)}
              </HoverContainer>
            </BaseStylesDiv>
          </StyledPanelButton>
        ))
      : json[index].emojis.map((item, index) => (
          <StyledPanelButton
            key={index}
            onClick={(e: any) => onEmojiSelect(item)}
          >
            <BaseStylesDiv style={{ width: "29px", height: "29px" }}>
              <HoverContainer stretch>
                <Absolute noMargin style={{ borderRadius: "4px" }} />
                {createEmoji(item.unicode, item.name)}
              </HoverContainer>
            </BaseStylesDiv>
          </StyledPanelButton>
        ));
  }

  return (
    <BaseStylesDiv style={{ maxWidth: "300px", minHeight: "470px" }}>
      <StyledContainer>
        <BaseStylesDiv
          flexGrow
          style={{
            borderBottom: "1px solid var(--colors-border)",
            padding: "10px 7px 5px 7px",
          }}
        >
          <TextFormField
            name="search"
            autoComplete="off"
            onChange={(e: any) => setSearchEmoji(e.target.value)}
          />
        </BaseStylesDiv>
        <BaseStylesDiv
          flexGrow
          style={{
            borderBottom: "1px solid var(--colors-border)",
            padding: "5px 7px 10px 7px",
          }}
        >
          {createCategories()}
        </BaseStylesDiv>
        <BaseStylesDiv
          style={{
            borderBottom: "1px solid var(--colors-border)",
            padding: "10px 15px",
          }}
        >
          <SpanContainer bigger bolder>
            <span>
              {searchEmoji &&
              searchEmoji.length &&
              foundEmojis &&
              foundEmojis!.length > 0
                ? "Search result"
                : json[categoryIdx].name}
            </span>
          </SpanContainer>
        </BaseStylesDiv>
        <StyledBody>{createEmojis(categoryIdx)}</StyledBody>
      </StyledContainer>
    </BaseStylesDiv>
  );
};
