import * as React from "react";
import { SearchBar } from "./SearchBar";
import { Trends } from "./Trends";
import { User } from "../../generated/graphql";
import { AuthButtons } from "./AuthButtons";
import { StyledContainer, StyledWrapper } from "./styles";
import { SuggestedUsers } from "./SuggestedUsers";

interface Props {
  user?: User;
}

export const SecondaryColumn: React.FC<Props> = ({ user }) => {
  return (
    <StyledContainer>
      <StyledWrapper>
        {user!.username === "" ? <AuthButtons /> : null}
        <SearchBar />
        <Trends />
        {user!.username !== "" ? <SuggestedUsers user={user!} /> : null}
      </StyledWrapper>
    </StyledContainer>
  );
};
