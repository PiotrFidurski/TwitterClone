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
import { Header } from "../../components/Header";
import { Profile, tabsData } from "./Profile";
import {
  GetUserByNameQuery,
  User,
  GetUserByNameDocument,
} from "../../generated/graphql";
import { SecondaryColumn } from "../../components/SecondaryColumn";
import { useQuery } from "@apollo/client";
import { Tabs } from "./Profile/Tabs";

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
`;

interface Props {
  user: User;
}

export const ProfilePage: React.FC<Props> = ({ user }) => {
  const { username } = useParams<{ username: string }>();

  const { data, loading } = useQuery<GetUserByNameQuery>(
    GetUserByNameDocument,
    {
      variables: { username },
    }
  );

  React.useEffect(() => window.scrollTo({ top: 0 }), []);

  if (loading)
    return (
      <BaseStylesDiv flexGrow style={{ maxWidth: "600px" }}>
        <Spinner />
      </BaseStylesDiv>
    );

  return (
    <StyledContainer>
      <PrimaryColumn>
        {data?.userByName!.__typename === "UserByNameInvalidInputError" ? (
          <BaseStylesDiv flexGrow>
            <JustifyCenter>
              <SpanContainer bigger bolder>
                {data.userByName.message}
              </SpanContainer>
            </JustifyCenter>
          </BaseStylesDiv>
        ) : (
          <>
            <Header justifyStart>{data?.userByName.node.username}</Header>
            <Profile user={data?.userByName.node!} />
            <Tabs data={tabsData} />
          </>
        )}
      </PrimaryColumn>

      <SidebarColumn>
        <SecondaryColumn user={user} />
      </SidebarColumn>
    </StyledContainer>
  );
};
