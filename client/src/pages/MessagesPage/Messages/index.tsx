import * as React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  User,
  MessagesQuery,
  MessagesDocument,
  LeftAtQuery,
  LeftAtDocument,
  Conversation,
  Message as MessageType,
  LeftAtSuccess,
  MessagesConnection,
} from "../../../generated/graphql";
import {
  SpanContainer,
  BaseStyles,
  BaseStylesDiv,
  Spinner,
  JustifyCenter,
} from "../../../styles";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { Field } from "formik";
import { Message } from "./Message";
import { Form } from "./Form";
import { MessageHeader } from "./Header";

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

  const { data: leftAtData } = useQuery<LeftAtQuery>(LeftAtDocument, {
    variables: { userId: user!.id!, conversationId: conversationId },
  });
  const leftAtMessageId =
    leftAtData! && leftAtData!.leftAt!.__typename !== "LeftAtInvalidInputError"
      ? leftAtData!.leftAt.node.leftAtMessageId
      : "";
  const { data, loading, fetchMore } = useQuery<MessagesQuery>(
    MessagesDocument,
    {
      variables: {
        leftAtMessageId,
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

  const loadMore = React.useCallback(async (): Promise<any> => {
    if (data!.messages.__typename !== "MessagesInvalidInputError") {
      const endCursor = data?.messages.pageInfo.endCursor;
      if (data?.messages.pageInfo.hasPreviousPage) {
        await fetchMore({
          variables: {
            limit: 25,
            cursorId: endCursor,
          },
        });
      }
    }
  }, [data, fetchMore]);

  if (loading && !data) return <Spinner />;

  return data?.messages.__typename === "MessagesInvalidInputError" ? (
    <BaseStylesDiv flexGrow flexColumn style={{ paddingTop: "50%" }}>
      <JustifyCenter>
        <SpanContainer bolder bigger textCenter breakSpaces>
          <span>{data.messages.message}</span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : (
    <>
      <MessageHeader messages={data!.messages!.edges!} receiver={receiver} />
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
          dataLength={data!.messages!.edges!.length}
          next={loadMore}
          hasMore={data!.messages!.pageInfo?.hasPreviousPage!}
        >
          {data!.messages!.edges!.map((message, index) => (
            <Message
              index={index}
              message={message}
              key={message.node.id}
              messages={(data!.messages as MessagesConnection)!.edges!}
              receiver={receiver}
              user={user}
            />
          ))}
        </InfiniteScroll>
      </StyledContainer>
      <Form
        user={user}
        connection={data!.messages!}
        conversation={data!.messages!.conversation! as Conversation}
      />
    </>
  );
};
