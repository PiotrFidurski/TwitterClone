import * as React from "react";
import { ReactComponent as Search } from "../svgs/Search.svg";
import { BaseStyles } from "../../styles";
import styled from "styled-components";

const StyledContainer = styled.div`
  ${BaseStyles};
  position: fixed;
  top: 0;
  z-index: 3;
  background-color: var(--colors-mainbackground);
  height: 53px;
  width: 350px;
  margin-bottom: 10px;
  flex-grow: 1;
  align-items: center;
  @media screen and (max-width: 1095px) {
    width: 290px;
  }
`;

const StyledWrapper = styled.div`
  ${BaseStyles};
  background-color: var(--colors-thirdbackground);
  border-radius: 9999px;
  flex-grow: 1;
  color: rgb(136, 153, 166);
  align-items: center;
  > svg {
    padding-left: 10px;
  }
`;

const SearchInput = styled.div`
  ${BaseStyles};
  flex-basis: 80%;
  background-color: var(--colors-thirdbackground);
  > input {
    ${BaseStyles};
    padding: 12px;
    flex-grow: 1;
    background-color: var(--colors-thirdbackground);
    outline: none;
    color: white;
  }
`;

export const SearchBar = () => (
  <StyledContainer>
    <StyledWrapper>
      <Search />
      <SearchInput>
        <input />
      </SearchInput>
    </StyledWrapper>
  </StyledContainer>
);
