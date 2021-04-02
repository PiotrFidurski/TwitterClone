import { useApolloClient, useMutation } from "@apollo/client";
import * as React from "react";
import { useLocation } from "react-router";
import { Link, Route } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../../components/Header";
import {
  User,
  Conversation,
  ReadConversationDocument,
  ReadConversationMutation,
  UpdateLastSeenMessageMutation,
  UpdateLastSeenMessageDocument,
} from "../../generated/graphql";
import { UserInboxQueryResult } from "../../generated/introspection-result";

import {
  AvatarContainer,
  BaseStyles,
  BaseStylesDiv,
  SpanContainer,
  StyledAvatar,
} from "../../styles";
import { Messages } from "./Messages";

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  height: auto;
  justify-content: stretch;
  flex-shrink: 1;
  width: 100%;
  border-left: 1px solid var(--colors-border);
`;

const StyledConversationWrapper = styled.div<{ location: string }>`
  ${BaseStyles};
  flex-direction: column;
  flex: 1 1 0%;
  max-width: 600px;
  @media only screen and (max-width: 1010px) {
    ${(props) =>
      props.location === "/messages" ? "flex: 1 1 0%;" : "flex: 0 1 0%"};
  }
`;

const StyledConversationDetails = styled.div`
  ${BaseStyles};
  flex-direction: column;
  overflow: auto;
  flex-shrink: 0;
`;

const StyledConversation = styled.div<{ recentMessage: boolean }>`
  ${BaseStyles};
  flex-grow: 1;
  padding: 10px;
  overflow: hidden;
  border-bottom: 1px solid var(--colors-border);
  background-color: ${(props) =>
    props.recentMessage! ? "rgb(33 50 66)" : "transparent"};
  :hover {
    cursor: pointer;
    background-color: var(--colors-background);
  }
`;

const StyledMessageContainer = styled.div<{ location: string }>`
  ${BaseStyles};
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid var(--colors-border);
  max-width: 600px;
  flex: 1.54 1 0%;
  width: 0px;
  @media only screen and (max-width: 1010px) {
    ${(props) =>
      props.location === "/messages" ? "flex: 0 1 0%;" : "flex: 1.54 1 0%"};
  }
  border-left: 1px solid var(--colors-border);
`;

interface Props {
  user: User;
  userInbox: UserInboxQueryResult;
}

export const MessagesPage: React.FC<Props> = ({ user, userInbox }) => {
  const location = useLocation();
  const { data, loading } = userInbox;
  const conversation = (conversationId: string): Conversation => {
    return (!loading &&
      data &&
      data!.userInbox! &&
      data!.userInbox!.filter(
        (conversation) => conversation.conversationId === conversationId
      )[0]) as Conversation;
  };

  return (
    <StyledContainer>
      <StyledConversationWrapper location={location.pathname}>
        <Header justifyStart>
          <BaseStylesDiv
            flexGrow
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <SpanContainer biggest bolder>
              <span>Messages</span>
            </SpanContainer>
            <BaseStylesDiv>
              {/* <Link
                to={{
                  pathname: "/messages/compose",
                  state: { isModalLoc: location },
                }}
              >
                <ButtonContainer
                  noMarginLeft
                  noPadding
                  style={{
                    border: "none",
                    minWidth: "40px",
                    minHeight: "40px",
                  }}
                >
                  <div>
                    <NewMessage fill="var(--colors-button)" />
                  </div>
                </ButtonContainer>
              </Link> */}
            </BaseStylesDiv>
          </BaseStylesDiv>
        </Header>
        <StyledConversationDetails>
          {!loading && data && data!.userInbox
            ? data!.userInbox!.map((conversation) => (
                <ConversationCmp
                  user={user}
                  conversation={conversation}
                  key={conversation.id}
                />
              ))
            : null}
        </StyledConversationDetails>
      </StyledConversationWrapper>
      <StyledMessageContainer location={location.pathname}>
        <Route path="/messages/:conversationId">
          {!loading && data!.userInbox ? (
            <Messages user={user} conversation={conversation} />
          ) : null}
        </Route>
      </StyledMessageContainer>
    </StyledContainer>
  );
};

const ConversationCmp: React.FC<{
  conversation: Conversation;
  user: User;
}> = ({ conversation, user }) => {
  const [markAsSeen] = useMutation<UpdateLastSeenMessageMutation>(
    UpdateLastSeenMessageDocument
  );
  const { cache } = useApolloClient();
  const [readConversation] = useMutation<ReadConversationMutation>(
    ReadConversationDocument
  );

  const authUser = conversation!.participants!.filter(
    (_user) => _user.userId === user.id
  )[0];

  return (
    <Link
      style={{ textDecoration: "none" }}
      onClick={() => {
        markAsSeen({
          variables: {
            conversationId: conversation!.conversationId,
            messageId:
              conversation!.messages_conversation! &&
              conversation!.messages_conversation!.length
                ? conversation!.messages_conversation![0].messagedata.id
                : "",
          },
        });
        readConversation({
          variables: {
            conversationId: conversation!.conversationId,
            messageId:
              conversation!.messages_conversation! &&
              conversation!.messages_conversation!.length
                ? conversation!.messages_conversation![0].messagedata.id
                : "",
          },
        });
        cache.modify({ fields: { userInbox(cachedEntries) {} } });
      }}
      key={conversation.id}
      to={{ pathname: `/messages/${conversation.conversationId}` }}
    >
      <StyledConversation
        key={conversation.id}
        recentMessage={
          conversation!.lastReadMessageId !== authUser!.lastReadMessageId
        }
        onClick={() => {}}
      >
        <BaseStylesDiv
          flexGrow
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <section style={{ display: "contents" }}>
            <AvatarContainer height="49px" width={49} noRightMargin>
              <StyledAvatar url={conversation.user.avatar} />
            </AvatarContainer>

            <BaseStylesDiv
              flexGrow
              flexColumn
              style={{
                margin: "4px 0px 0px 10px",
                textOverflow: "ellipsis",
                width: "0px",
              }}
            >
              <SpanContainer bold>
                <span>{conversation.user.username}</span>
              </SpanContainer>
              {conversation!.messages_conversation! &&
              conversation!.messages_conversation!.length ? (
                <SpanContainer grey smaller>
                  <span>
                    {conversation!.messages_conversation![0].messagedata!.text!}
                  </span>
                </SpanContainer>
              ) : null}
            </BaseStylesDiv>
          </section>
        </BaseStylesDiv>
      </StyledConversation>
    </Link>
  );
};
