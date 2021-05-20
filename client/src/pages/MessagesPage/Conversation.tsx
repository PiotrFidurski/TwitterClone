import { useMutation } from "@apollo/client";
import * as React from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import {
  User,
  Conversation as ConversationType,
  ReadConversationMutation,
  ReadConversationDocument,
} from "../../generated/graphql";
import {
  BaseStylesDiv,
  AvatarContainer,
  StyledAvatar,
  SpanContainer,
} from "../../styles";
import { convertDateToTime } from "../../utils/functions";
import { useMarkMessagesAsSeen } from "../../hooks/useMarkMessagesAsSeen";
import { Twemoji } from "../../components/TwemojiPicker/Twemoji";
import {
  StyledConversation,
  StyledConversationWrapper,
  StyledConversationHeader,
} from "./styles";

interface Props {
  conversation: ConversationType;
  user: User;
  getReceiver: (conversationId: string) => User;
}

export const Conversation: React.FC<Props> = ({
  conversation,
  user,
  getReceiver,
}) => {
  const receiver = getReceiver(conversation!.conversationId!);

  const updateSeenMessages = useMarkMessagesAsSeen([conversation]);

  const history = useHistory();

  const location = useLocation();

  const [readConversation] = useMutation<ReadConversationMutation>(
    ReadConversationDocument
  );

  const [{ lastReadMessageId }] = conversation!.participants!.filter(
    (u) => u.userId === user.id
  );

  React.useEffect(() => {
    if (location.pathname === `/messages/${conversation.conversationId}`) {
      readConversation({
        variables: {
          conversationId: conversation!.conversationId,
          messageId: conversation.mostRecentEntryId,
        },
      });
      updateSeenMessages();
    }
    //eslint-disable-next-line
  }, [location, conversation.mostRecentEntryId]);

  return (
    <StyledConversation
      key={conversation.id}
      onClick={() => {
        history.push(`/messages/${conversation.conversationId}`);
      }}
      recentMessage={lastReadMessageId !== conversation!.mostRecentEntryId}
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
        <StyledConversationWrapper>
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
        </StyledConversationWrapper>
      </BaseStylesDiv>
    </StyledConversation>
  );
};
