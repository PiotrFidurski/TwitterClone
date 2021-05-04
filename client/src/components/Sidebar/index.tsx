import * as React from "react";
import { Absolute, HoverContainer } from "../../styles";
import {
  StyledContainer,
  StyledWrapper,
  FixedContainer,
  NavLink,
  NavContainer,
} from "./styles";

export const SideBar: React.FC = ({ children }) => {
  return (
    <StyledContainer>
      <FixedContainer>
        <StyledWrapper>{children}</StyledWrapper>
      </FixedContainer>
    </StyledContainer>
  );
};

interface Props {
  path?: string;
}

export const Link: React.FC<Props> = ({ children, path = "/home" }) => {
  return (
    <NavLink to={path}>
      <HoverContainer>
        <Absolute noMargin />
        {children}
      </HoverContainer>
    </NavLink>
  );
};

export const Nav: React.FC = ({ children }) => {
  return <NavContainer>{children}</NavContainer>;
};
