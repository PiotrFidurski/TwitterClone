import styled from "styled-components";
import { BaseStyles } from "../../../styles";

export const Background = styled.div`
  ${BaseStyles};
  padding-bottom: 33.5%;
  background-color: rgb(61, 84, 102);
`;

export const Wrapper = styled.div`
  ${BaseStyles};
  margin-bottom: 15px;
  padding: 10px 15px 0 15px;
  flex-direction: column;
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
