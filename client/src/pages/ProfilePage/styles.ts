import styled from "styled-components";
import { BaseStyles } from "../../styles";

export const StyledHeaderContainer = styled.div`
  ${BaseStyles};
  color: white;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px 0 15px;
`;

export const StyledContainer = styled.div`
  ${BaseStyles};
  color: white;
  padding: 0 15px 0 15px;
  width: 0px;
  flex-grow: 1;
`;

export const Background = styled.div`
  ${BaseStyles};
  padding-bottom: 33.5%;
  flex-grow: 1;
  flex-direction: column;
  background-color: rgb(61, 84, 102);
`;

export const NavWrapper = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  margin-top: 15px;

  position: unset;
  height: 50px;
  border-bottom: 1px solid var(--colors-border);
`;

export const NavItem = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;
