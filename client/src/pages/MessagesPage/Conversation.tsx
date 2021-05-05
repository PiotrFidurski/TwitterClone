import { useMutation } from "@apollo/client";
import * as React from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import {
  User,
  Conversation as ConversationType,
  ReadConversationMutation,
  ReadConversationDocument,
  UserInboxQueryResult,
} from "../../generated/graphql";
import {
  BaseStylesDiv,
  AvatarContainer,
  StyledAvatar,
  SpanContainer,
  BaseStyles,
} from "../../styles";
import { convertDateToTime } from "../../utils/functions";
import styled from "styled-components";
import { useMarkMessagesAsSeen } from "../../hooks/useMarkMessagesAsSeen";
import { Twemoji } from "../../components/TwemojiPicker/Twemoji";

const StyledContainer = styled.div<{ recentMessage: boolean }>`
  ${BaseStyles};
  flex-grow: 0;
  padding: 10px;
  overflow: auto;
  border-bottom: 1px solid var(--colors-border);
  background-color: ${(props) =>
    props.recentMessage! ? "var(--colors-thirdbackground)" : "transparent"};
  :hover {
    cursor: pointer;
    background-color: var(--colors-background);
  }
`;

const StyledWrapper = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  flex-direction: column;
  margin: 4px 0px 0px 10px;
  text-overflow: ellipsis;
  width: 0px;
`;

const StyledConversationHeader = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: space-between;
`;

interface Props {
  conversation: ConversationType;
  user: User;
  getReceiver: (conversationId: string) => User;
  userInbox: UserInboxQueryResult;
}

export const Conversation: React.FC<Props> = ({
  conversation,
  user,
  getReceiver,
  userInbox,
}) => {
  const receiver = getReceiver(conversation!.conversationId!);

  const handleMarkAsSeen = useMarkMessagesAsSeen(
    userInbox!.data!.userInbox!.conversations!
  );

  const history = useHistory();
  const location = useLocation();

  const [readConversation] = useMutation<ReadConversationMutation>(
    ReadConversationDocument
  );

  const authUser = conversation!.participants!.filter(
    (_user) => _user.userId === user.id
  )[0];

  React.useEffect(() => {
    if (
      location.pathname === `/messages/${conversation.conversationId}` &&
      authUser.lastReadMessageId !== ""
    ) {
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
      handleMarkAsSeen();
    }
    //eslint-disable-next-line
  }, [location, conversation.mostRecentEntryId]);

  return (
    <StyledContainer
      key={conversation.id}
      onClick={() => {
        history.push(`/messages/${conversation.conversationId}`);
      }}
      recentMessage={
        conversation!.lastReadMessageId !== authUser!.lastReadMessageId
      }
    >
      <BaseStylesDiv flexGrow>
        <Link
          to={{ pathname: `/user/${receiver.username}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <AvatarContainer height="49px" width={49} noRightMargin>
            <StyledAvatar url={receiver.avatar} />
          </AvatarContainer>
        </Link>
        <StyledWrapper>
          <BaseStylesDiv>
            <StyledConversationHeader>
              <SpanContainer bold>
                <span>{receiver!.username}</span>
              </SpanContainer>
              <SpanContainer grey>
                <span>
                  {conversation!.messages_conversation!.length
                    ? convertDateToTime(conversation!.messages_conversation![0])
                    : null}
                </span>
              </SpanContainer>
            </StyledConversationHeader>
          </BaseStylesDiv>
          {conversation!.messages_conversation! &&
          conversation!.messages_conversation!.length ? (
            <SpanContainer grey>
              <span>
                <Twemoji>
                  {conversation!.messages_conversation![0].messagedata!.text!}
                </Twemoji>
              </span>
            </SpanContainer>
          ) : null}
        </StyledWrapper>
      </BaseStylesDiv>
    </StyledContainer>
  );
};
