import * as React from "react";
import styled from "styled-components";
import {
  BaseStyles,
  BaseStylesDiv,
  JustifyCenter,
  PrimaryColumn,
  SidebarColumn,
  SpanContainer,
} from "../../styles";
import { useParams } from "react-router-dom";
import { User } from "../../generated/introspection-result";
import { Header } from "../../components/Header";
import { Conversation } from "./Conversation";
import { useQuery } from "@apollo/client";
import { TweetDocument, TweetQuery } from "../../generated/graphql";
import { SecondaryColumn } from "../../components/SecondaryColumn";

interface Props {
  user: User;
}

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: flex;
  flex-grow: 1;
  opacity: 1;
  justify-content: space-between;
`;

export const CommentsPage: React.FC<Props> = ({ user }) => {
  const { tweetId } = useParams<{ tweetId: string }>();

  const { data, loading } = useQuery<TweetQuery>(TweetDocument, {
    variables: { tweetId },
  });

  React.useEffect(() => window.scrollTo({ top: 0 }), []);
  if (loading) return <></>;

  return (
    <StyledContainer>
      <PrimaryColumn>
        {data?.tweet.__typename === "TweetInvalidInputError" ? (
          <BaseStylesDiv flexGrow>
            <JustifyCenter>
              <SpanContainer bigger bolder>
                {data.tweet.message}
              </SpanContainer>
            </JustifyCenter>
          </BaseStylesDiv>
        ) : (
          <>
            <Header justifyStart>Tweet</Header>
            {data?.tweet.__typename === "TweetSuccess" ? (
              <Conversation tweet={data!.tweet!.node} user={user} />
            ) : null}
          </>
        )}
      </PrimaryColumn>
      {user && user.username ? (
        <SidebarColumn>
          <SecondaryColumn user={user} />
        </SidebarColumn>
      ) : null}
    </StyledContainer>
  );
};
