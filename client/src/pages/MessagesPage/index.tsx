import * as React from "react";
import { useLocation } from "react-router";
import { Route } from "react-router-dom";
import { Header } from "../../components/Header";
import { UserInboxQueryResult, User } from "../../generated/graphql";
import { SpanContainer } from "../../styles";
import { Conversation } from "./Conversation";
import { Messages } from "./Messages";
import {
  StyledContainer,
  StyledConversationContainer,
  StyledWrapper,
  StyledMessagesContainer,
} from "./styles";

interface Props {
  user: User;
  userInbox: UserInboxQueryResult;
}

export const MessagesPage: React.FC<Props> = ({ user, userInbox }) => {
  const location = useLocation();
  const { data, loading } = userInbox;

  const getReceiver = (conversationId: string) => {
    const userIds = conversationId.split("-");
    const userId = userIds[0] !== user!.id ? userIds[0] : userIds[1];
    return data!.userInbox!.users!.filter((user) => user.id === userId)[0];
  };

  return (
    <StyledContainer>
      <StyledWrapper location={location.pathname}>
        <Header justifyStart>
          <SpanContainer biggest bolder>
            <span>Messages</span>
          </SpanContainer>
        </Header>
        <StyledConversationContainer>
          {!loading && data
            ? data!.userInbox!.conversations!.map((conversation) => (
                <Conversation
                  user={user}
                  userInbox={userInbox}
                  getReceiver={getReceiver}
                  conversation={conversation}
                  key={conversation.id}
                />
              ))
            : null}
        </StyledConversationContainer>
      </StyledWrapper>
      <StyledMessagesContainer location={location.pathname}>
        <Route path="/messages/:conversationId">
          {data!.userInbox ? (
            <Messages user={user} getReceiver={getReceiver} />
          ) : null}
        </Route>
      </StyledMessagesContainer>
    </StyledContainer>
  );
};
