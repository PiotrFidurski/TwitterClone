import * as React from "react";
import styled from "styled-components";
import {
  BaseStyles,
  Spinner,
  JustifyCenter,
  BaseStylesDiv,
  SpanContainer,
  PrimaryColumn,
  SidebarColumn,
} from "../../styles";
import { useParams } from "react-router-dom";
import { useUserByNameQuery } from "../../generated/introspection-result";
import { Header } from "../../components/Header";
import { Profile } from "./Profile";
import { User, UserInboxQueryResult } from "../../generated/graphql";
import { SecondaryColumn } from "../../components/SecondaryColumn";

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
`;

interface Props {
  user: User;
  userInbox?: UserInboxQueryResult;
}

export const ProfilePage: React.FC<Props> = ({ user, userInbox }) => {
  const { username } = useParams<{ username: string }>();

  const { data, loading } = useUserByNameQuery({
    variables: { username: username! },
  });

  React.useEffect(() => window.scrollTo({ top: 0 }), []);

  if (loading) return <Spinner />;

  if (!data || data!.userByName!.__typename === "UserByNameInvalidInputError") {
    return (
      <BaseStylesDiv flexGrow>
        <JustifyCenter>
          <SpanContainer bigger bolder>
            Sorry, that page doesn’t exist!
          </SpanContainer>
        </JustifyCenter>
      </BaseStylesDiv>
    );
  }

  return (
    <StyledContainer>
      {data! &&
        data!.userByName! &&
        data!.userByName!.__typename === "UserByNameSuccess" && (
          <PrimaryColumn>
            <Header justifyStart>{data!.userByName!.node.name}</Header>
            <Profile user={data!.userByName!.node} inbox={userInbox!} />
          </PrimaryColumn>
        )}

      {user && user!.username ? (
        <SidebarColumn>
          <SecondaryColumn user={user} />
        </SidebarColumn>
      ) : null}
    </StyledContainer>
  );
};
