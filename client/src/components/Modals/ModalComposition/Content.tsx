import * as React from "react";
import styled from "styled-components";
import { BaseStyles } from "../../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  display: block;
  overflow: hidden;
  overflow-y: auto;
  flex-grow: 1;
  height: auto;
  width: 100%;
`;

export const Content: React.FC = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};
