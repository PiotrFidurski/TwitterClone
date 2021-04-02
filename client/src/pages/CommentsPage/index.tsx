import * as React from "react";
import styled from "styled-components";
import {
  BaseStyles,
  BaseStylesDiv,
  fade,
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
import { AuthUserDocument, PostDocument } from "../../generated/graphql";
import { SecondaryColumn } from "../../components/SecondaryColumn";
import { AuthButtons } from "../../components/SecondaryColumn/AuthButtons";

interface Props {
  user: User;
}

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: flex;
  flex-grow: 1;
  opacity: 1;
  justify-content: space-between;
  animation-name: ${fade};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.15s;
`;

export const CommentsPage: React.FC<Props> = ({ user }) => {
  const { postId } = useParams<{ postId: string }>();

  const { data, loading } = useQuery(PostDocument, {
    variables: { postId: postId! },
    skip: !postId,
  });

  React.useEffect(() => window.scrollTo({ top: 0 }), []);
  if (loading) return <></>;

  if (!data || data!.post!.__typename === "PostByIdInvalidInputError") {
    return postId ? (
      <BaseStylesDiv flexGrow>
        <JustifyCenter>
          <SpanContainer bigger bolder>
            Sorry, that page doesn’t exist!
          </SpanContainer>
        </JustifyCenter>
      </BaseStylesDiv>
    ) : null;
  }

  return (
    <StyledContainer id="feed">
      <PrimaryColumn>
        <Header justifyStart>Tweet</Header>
        {data && data!.post && data!.post!.__typename === "PostByIdSuccess" && (
          <Conversation post={data!.post!.node!} user={user} />
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
