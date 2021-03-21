import { useQuery } from "@apollo/client";
import * as React from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../../components/Header";
import { ReactComponent as NewMessage } from "../../components/svgs/NewMessage.svg";
import {
  UserConversationsDocument,
  User,
  UserConversationsQuery,
} from "../../generated/graphql";
import {
  AvatarContainer,
  BaseStyles,
  BaseStylesDiv,
  ButtonContainer,
  SpanContainer,
  Spinner,
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

const StyledConversationWrapper = styled.div`
  ${BaseStyles};
  flex-direction: column;
  flex: 1 1 0%;
  max-width: 600px;
`;

const StyledConversationDetails = styled.div`
  ${BaseStyles};
  flex-direction: column;
  overflow: auto;
  flex-shrink: 0;
`;

const StyledConversation = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  padding: 10px;
  overflow: hidden;
  border-bottom: 1px solid var(--colors-border);
  :hover {
    cursor: pointer;
    background-color: var(--colors-background);
  }
`;

const StyledMessageContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid var(--colors-border);
  max-width: 600px;
  flex: 1.54 1 0%;
  width: 0px;
  border-left: 1px solid var(--colors-border);
`;

interface Props {
  user: User;
}

export const MessagesPage: React.FC<Props> = ({ user }) => {
  const { data, loading } = useQuery<UserConversationsQuery>(
    UserConversationsDocument
  );

  if (!loading) <Spinner />;

  return (
    <StyledContainer>
      <StyledConversationWrapper>
        <Header justifyStart>
          <BaseStylesDiv
            flexGrow
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <SpanContainer biggest bolder>
              <span>Messages</span>
            </SpanContainer>
            <BaseStylesDiv>
              <Link to={{ pathname: "/messages/compose" }}>
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
              </Link>
            </BaseStylesDiv>
          </BaseStylesDiv>
        </Header>
        <StyledConversationDetails>
          {!loading && data
            ? data!.userConversations!.map((conversation) => (
                <Link
                  style={{ textDecoration: "none" }}
                  key={conversation.id}
                  to={{ pathname: `/messages/${conversation.id}` }}
                >
                  <StyledConversation key={conversation.id}>
                    <BaseStylesDiv
                      flexGrow
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      {conversation!
                        .members!.filter((member) => member.id !== user.id)
                        .slice(Math.max(conversation!.members!.length - 3, 0))
                        .map((user, index) =>
                          conversation!.members!.filter(
                            (member) => member.id !== user.id
                          ).length > 1 ? (
                            <section
                              key={user.id}
                              style={{ display: "contents" }}
                            >
                              <AvatarContainer
                                style={
                                  index % 2 !== 0 || index !== 0
                                    ? { transform: "scaleX(-1)" }
                                    : {}
                                }
                                displayAsGroup
                                height="49px"
                                width={49}
                              >
                                <StyledAvatar url={user.avatar} />
                              </AvatarContainer>
                              <BaseStylesDiv
                                style={
                                  index % 2 === 0 || index === 0
                                    ? {
                                        height: "100%",
                                        width: "1px",
                                        backgroundColor:
                                          "var(--colors-mainbackground)",
                                      }
                                    : {}
                                }
                              ></BaseStylesDiv>
                            </section>
                          ) : (
                            <section
                              key={user.id}
                              style={{ display: "contents" }}
                            >
                              <AvatarContainer
                                height="49px"
                                width={49}
                                noRightMargin
                              >
                                <StyledAvatar url={user.avatar} />
                              </AvatarContainer>
                            </section>
                          )
                        )}
                      <BaseStylesDiv
                        flexGrow
                        style={{
                          margin: "4px 0px 0px 10px",
                          textOverflow: "ellipsis",
                          width: "0px",
                        }}
                      >
                        <SpanContainer bold>
                          {conversation!
                            .members!.filter((member) => member.id !== user.id)
                            .map((user, index) => (
                              <section
                                key={user.id}
                                style={{ display: "contents" }}
                              >
                                <span>{user.username}</span>
                                <span>
                                  {index <
                                  conversation!.members!.filter(
                                    (member) => member.id !== user.id
                                  ).length -
                                    1
                                    ? ","
                                    : ""}
                                </span>
                                <span>&nbsp;</span>
                              </section>
                            ))}
                        </SpanContainer>
                      </BaseStylesDiv>
                    </BaseStylesDiv>
                  </StyledConversation>
                </Link>
              ))
            : null}
        </StyledConversationDetails>
      </StyledConversationWrapper>
      <StyledMessageContainer>
        <Route path="/messages/:conversationId">
          {data && <Messages user={user} members={data!} />}
        </Route>
      </StyledMessageContainer>
    </StyledContainer>
  );
};
