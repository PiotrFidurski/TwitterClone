import { useMutation } from "@apollo/client";
import * as React from "react";
import { useLocation, Link } from "react-router-dom";
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
// import Twemoji from "react-twemoji";
import twemoji from "twemoji";
import { convertDateToTime } from "../../utils/functions";
import styled from "styled-components";
import { useReadAllUnseenMessages } from "../../hooks/useReadAllUnseenMessages";
import { LabelContainer } from "../../components/FormComponents/TextFormField";

const StyledContainer = styled.div<{ recentMessage: boolean }>`
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
  const receiver = getReceiver(conversation!.conversationId);

  const handleMarkAsSeen = useReadAllUnseenMessages(
    userInbox!.data!.userInbox!.conversations!
  );

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
  }, [location, conversation.mostRecentEntryId, readConversation]);

  return (
    <Link
      style={{ textDecoration: "none" }}
      to={{ pathname: `/messages/${conversation.conversationId}` }}
    >
      <StyledContainer
        key={conversation.id}
        recentMessage={
          conversation!.lastReadMessageId !== authUser!.lastReadMessageId
        }
      >
        <BaseStylesDiv flexGrow>
          <Link to={{ pathname: `/user/${receiver.username}` }}>
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
                      ? convertDateToTime(
                          conversation!.messages_conversation![0]
                        )
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
    </Link>
  );
};

export const Twemoji: React.FC = React.memo(
  ({ children }) => {
    const ref = React.useRef<string | HTMLElement>("");

    function parseTwemoji() {
      const node = ref.current;
      twemoji.parse(node);
    }

    React.useLayoutEffect(() => parseTwemoji(), [children]);

    return React.createElement("span", { ref }, children);
  },
  (prevProps, nextProps) => prevProps === nextProps
);
