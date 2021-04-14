import * as React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { Message as MessageType, User } from "../../../generated/graphql";
import { format } from "date-fns";
import {
  AvatarContainer,
  StyledAvatar,
  SpanContainer,
  BaseStylesDiv,
  BaseStyles,
} from "../../../styles";

const StyledContainer = styled.div<{
  isItMyMsg: boolean;
  margin: boolean;
  isItMyLastMsg: boolean;
}>`
  ${BaseStyles};
  align-items: center;
  margin-bottom: ${(props) => (props.isItMyLastMsg ? "10px" : "0")};
  margin-left: ${(props) => (props.margin ? "50px" : "0")};
  justify-content: ${(props) => (props.isItMyMsg ? "flex-end" : "flex-start")};
`;

const StyledWrapper = styled.div<{ isItMyMsg: boolean }>`
  ${BaseStyles};
  flex-direction: column;
  max-width: 80%;
  width: 100%;
  align-items: ${(props) => (props.isItMyMsg ? "flex-end" : "flex-start")};
`;

const StyledMessage = styled.div<{ isItMyMsg: boolean }>`
  ${({ isItMyMsg }) => css`
    ${BaseStyles};
    max-width: 85%;
    border: 1px solid
      ${isItMyMsg ? "var(--colors-button)" : "var(--colors-thirdbackground)"};
    border-radius: 16px;
    background-color: ${isItMyMsg
      ? "var(--colors-button)"
      : "var(--colors-thirdbackground)"};
    border-bottom-left-radius: ${isItMyMsg ? "16px" : "0px"};
    border-bottom-right-radius: ${isItMyMsg ? "0px" : "16px"};
    padding: 10px;
    margin: 0 5px 5px 5px;
    ${SpanContainer} {
      > span {
        color: ${isItMyMsg ? "white !important" : "var(--colors-maintext)"};
      }
    }
  `}
`;

interface Props {
  message: MessageType;
  messages: Array<MessageType>;
  index: number;
  receiver: User;
  user: User;
}

export const Message: React.FC<Props> = ({ ...props }) => {
  const { message, index, receiver, user, messages } = props;

  const isLast = (index: number) => {
    return !!(messages!.length && messages![index + 1]
      ? messages![index + 1].messagedata.senderId !==
        messages![index].messagedata.senderId
      : messages![index].id);
  };

  const isMine = (message: MessageType) =>
    !!(user.id === message.messagedata.senderId);

  return (
    <StyledContainer
      isItMyLastMsg={isLast(index)}
      margin={message.messagedata!.senderId !== user.id && !isLast(index)}
      isItMyMsg={isMine(message)}
    >
      <BaseStylesDiv style={{ height: "40px", alignSelf: "flex-start" }}>
        {message.messagedata!.senderId !== user.id && isLast(index) ? (
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
        <StyledMessage isItMyMsg={isMine(message)}>
          <SpanContainer breakSpaces>
            <span>{message.messagedata.text}</span>
          </SpanContainer>
        </StyledMessage>
        <BaseStylesDiv>
          <SpanContainer smaller grey style={{ marginLeft: "5px" }}>
            <span>
              {isLast(index)
                ? receiver.id !== message.messagedata!.senderId
                  ? null
                  : receiver.username
                : null}
            </span>
          </SpanContainer>
          {message!.messagedata!.senderId !== user.id && isLast(index) ? (
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
                {message.id.endsWith("sending...")
                  ? "Sending..."
                  : format(
                      new Date(
                        parseInt(message!.id.toString().substring(0, 8), 16) *
                          1000
                      ),
                      "MMM dd, yyyy, hh:mm aaa",
                      {}
                    )}
              </span>
            </SpanContainer>
          ) : null}
        </BaseStylesDiv>
      </StyledWrapper>
    </StyledContainer>
  );
};
