import * as React from "react";
import { SearchBar } from "./SearchBar";
import { Trends } from "./Trends";
import { WhoToFollow } from "./WhoToFollow";
import { User } from "../../generated/graphql";
import { BaseStyles } from "../../styles";
import styled from "styled-components";
import { AuthButtons } from "./AuthButtons";

const StyledContainer = styled.div`
  ${BaseStyles};
  display: block;
  padding-top: 10px;
  background-color: var(--colors-mainbackground);
  min-height: 1080px;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
`;

const StyledWrapper = styled.div`
  ${BaseStyles};
  margin-top: 53px;
  position: sticky;
  top: 0;
  bottom: 0;
  flex-direction: column;
`;

interface Props {
  user?: User;
}

export const SecondaryColumn: React.FC<Props> = ({ user }) => {
  return (
    <StyledContainer>
      <StyledWrapper>
        {!user ? <AuthButtons /> : null}
        <SearchBar />
        <Trends />
        {user ? <WhoToFollow user={user!} /> : null}
      </StyledWrapper>
    </StyledContainer>
  );
};
