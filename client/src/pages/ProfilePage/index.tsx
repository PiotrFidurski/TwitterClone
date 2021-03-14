import * as React from "react";
import styled from "styled-components";
import {
  BaseStyles,
  Spinner,
  JustifyCenter,
  BaseStylesDiv,
  SpanContainer,
} from "../../styles";
import { useParams } from "react-router-dom";
import { useUserByNameQuery } from "../../generated/introspection-result";
import { Header } from "../../components/Header";
import { Profile } from "./Profile";

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
`;

export const ProfilePage: React.FC = () => {
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
    <>
      {data! &&
        data!.userByName! &&
        data!.userByName!.__typename === "UserByNameSuccess" && (
          <StyledContainer>
            <Header justifyStart>{data!.userByName!.node.name}</Header>
            <Profile user={data!.userByName!.node} />
          </StyledContainer>
        )}
    </>
  );
};
