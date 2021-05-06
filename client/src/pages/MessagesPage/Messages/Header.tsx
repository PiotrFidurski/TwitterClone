import * as React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { DropdownProvider } from "../../../components/DropDown";
import { StyledDropDownItem } from "../../../components/DropDown/DropDownComposition/styles";
import { moveLeftReducer } from "../../../components/DropDown/reducers";
import { Header } from "../../../components/Header";
import {
  Conversation,
  LeaveConversationDocument,
  LeaveConversationMutation,
  MessageEdge,
  UpdateResourceResponse,
  User,
} from "../../../generated/graphql";
import { ReactComponent as Caret } from "../../../components/svgs/Caret.svg";
import { ReactComponent as LeaveConversation } from "../../../components/svgs/leaveConversation.svg";
import { ReactComponent as Mute } from "../../../components/svgs/mute.svg";
import { ReactComponent as Block } from "../../../components/svgs/block.svg";
import {
  BaseStylesDiv,
  AvatarContainer,
  StyledAvatar,
  SpanContainer,
  ButtonContainer,
} from "../../../styles";
import { useModalContext } from "../../../components/context/ModalContext";
import { useMutation } from "@apollo/client";

interface Props {
  receiver: User;
  messages: MessageEdge[];
}

export const MessageHeader: React.FC<Props> = ({ receiver, messages }) => {
  const { openModal } = useModalContext();

  const { conversationId } = useParams<{ conversationId: string }>();
  const history = useHistory();
  const [leaveConversation] = useMutation<LeaveConversationMutation>(
    LeaveConversationDocument,
    { variables: { conversationId: conversationId } }
  );

  const handleLeaveConversation = () => {
    leaveConversation({
      update: (cache, { data: _data }) => {
        const leaveConversation = (_data?.leaveConversation as UpdateResourceResponse)
          .node as Conversation;
        cache.modify({
          fields: {
            userInbox(cachedEntries) {
              return cachedEntries!.conversations!.filter(
                (conversation: any) => {
                  if (conversation!.__ref === leaveConversation.id) {
                    return {
                      ...conversation,
                      participants: leaveConversation.participants,
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
                leftAtMessageId: messages.length
                  ? messages[messages.length - 1].node.id
                  : "",
              };
            },
          },
        });
        history.push("/messages");
      },
    });
  };
  return (
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
  );
};
