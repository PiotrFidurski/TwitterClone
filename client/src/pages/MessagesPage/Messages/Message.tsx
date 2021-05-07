import * as React from "react";
import { Link } from "react-router-dom";

import { MessageEdge, User } from "../../../generated/graphql";
import { format } from "date-fns";
import {
  AvatarContainer,
  StyledAvatar,
  SpanContainer,
  BaseStylesDiv,
} from "../../../styles";
import { Twemoji } from "../../../components/TwemojiPicker/Twemoji";
import twemoji from "twemoji";
import { StyledMessage, StyledMessageContainer, StyledWrapper } from "./styles";

interface Props {
  message: MessageEdge;
  messages: Array<MessageEdge>;
  index: number;
  receiver: User;
  user: User;
}

export const Message: React.FC<Props> = React.memo(({ ...props }) => {
  const { message, index, receiver, user, messages } = props;

  const messageIsEmojiOnly = React.useCallback(() => {
    if (!!twemoji.test(message!.node.messagedata!.text!)) {
      const regex = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g;

      const replace = message!.node.messagedata!.text!.replace(regex, "");
      const match = message!.node.messagedata!.text!.match(regex);
      if (match!.length <= 10 && !replace.length) return true;
    }
    return false;
  }, [message]);

  const isLast = (index: number) => {
    return !!(messages!.length && messages![index + 1]
      ? messages![index + 1].node.messagedata.senderId !==
        messages![index].node.messagedata.senderId
      : messages![index].node.id);
  };

  const isMine = (message: MessageEdge) =>
    !!(user.id === message.node.messagedata.senderId);

  return (
    <StyledMessageContainer
      isItMyLastMsg={isLast(index)}
      margin={message.node.messagedata!.senderId !== user.id && !isLast(index)}
      isItMyMsg={isMine(message)}
    >
      <BaseStylesDiv style={{ height: "40px", alignSelf: "flex-start" }}>
        {message.node.messagedata!.senderId !== user.id && isLast(index) ? (
          <Link
            to={{
              pathname: `/user/${receiver.username}`,
            }}
          >
            <AvatarContainer
              height="40px"
              width={40}
              style={{ marginBottom: "15px" }}
            >
              <StyledAvatar url={receiver.avatar} />
            </AvatarContainer>
          </Link>
        ) : null}
      </BaseStylesDiv>
      <StyledWrapper isItMyMsg={isMine(message)}>
        <StyledMessage
          isItMyMsg={isMine(message)}
          isEmojiOnly={messageIsEmojiOnly()}
        >
          <SpanContainer breakSpaces>
            <span>
              <Twemoji>{message!.node.messagedata!.text!}</Twemoji>
            </span>
          </SpanContainer>
        </StyledMessage>
        <BaseStylesDiv>
          <SpanContainer smaller grey style={{ marginLeft: "5px" }}>
            <span>
              {isLast(index)
                ? receiver.id !== message.node.messagedata!.senderId
                  ? null
                  : receiver.username
                : null}
            </span>
          </SpanContainer>
          {message!.node.messagedata!.senderId !== user.id && isLast(index) ? (
            <SpanContainer
              grey
              style={{
                flexShrink: 0,
                padding: "0 5px 0 5px",
              }}
            >
              <span>·</span>
            </SpanContainer>
          ) : null}
          {isLast(index) ? (
            <SpanContainer grey smaller>
              <span>
                {message.node.id.endsWith("sending...")
                  ? "Sending..."
                  : format(
                      new Date(
                        parseInt(
                          message!.node.id.toString().substring(0, 8),
                          16
                        ) * 1000
                      ),
                      "MMM dd, yyyy, hh:mm aaa",
                      {}
                    )}
              </span>
            </SpanContainer>
          ) : null}
        </BaseStylesDiv>
      </StyledWrapper>
    </StyledMessageContainer>
  );
});
