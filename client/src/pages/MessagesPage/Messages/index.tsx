import * as React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useHistory, useParams } from "react-router-dom";
import { ReactComponent as LeaveConversation } from "../../../components/svgs/leaveConversation.svg";
import { ReactComponent as Caret } from "../../../components/svgs/Caret.svg";
import { ReactComponent as Mute } from "../../../components/svgs/mute.svg";
import { ReactComponent as Block } from "../../../components/svgs/block.svg";
import {
  User,
  ConversationMessagesQuery,
  ConversationMessagesDocument,
  LeaveConversationDocument,
  LeaveConversationMutation,
  LeftAtQuery,
  LeftAtDocument,
} from "../../../generated/graphql";
import {
  SpanContainer,
  BaseStyles,
  BaseStylesDiv,
  AvatarContainer,
  Spinner,
  StyledAvatar,
  ButtonContainer,
  JustifyCenter,
} from "../../../styles";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { Field } from "formik";
import { DropdownProvider } from "../../../components/DropDown";
import { moveLeftReducer } from "../../../components/DropDown/reducers";
import { StyledDropDownItem } from "../../../components/DropDown/DropDownComposition/Menu";
import { Header } from "../../../components/Header";
import { useModalContext } from "../../../components/context/ModalContext";
import { Message } from "./Message";
import { Form } from "./Form";

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

const SpinnerContainer = styled.div`
  position: absolute;
  top: 15px;
  width: 45px;
  border-radius: 50%;
  height: 45px;
  display: flex;
  align-items: center;
  flex-basis: auto;
  left: 50%;
  background-color: black;
`;

interface Props {
  user: User;
  getReceiver: (conversationId: string) => User;
}

export const Messages: React.FC<Props> = ({ user, getReceiver }) => {
  const { conversationId } = useParams<{ conversationId: string }>();

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

  React.useEffect(() => {
    const setHeightToWindowSize = () => setHeight(window.innerHeight);

    window.addEventListener("resize", setHeightToWindowSize);
    return () => window.removeEventListener("resize", setHeightToWindowSize);
  }, []);

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
      <StyledContainer height={height} id="scrollableDiv">
        <InfiniteScroll
          style={{ position: "relative" }}
          scrollableTarget="scrollableDiv"
          inverse={true}
          loader={
            <SpinnerContainer>
              <Spinner />
            </SpinnerContainer>
          }
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
          ))}
        </InfiniteScroll>
      </StyledContainer>
      <Form
        user={user}
        conversation={data!.conversationMessages!.conversation!}
      />
    </>
  );
};
