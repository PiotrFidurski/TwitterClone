import * as React from "react";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { LoadingPage } from "../pages/LoadingPage";
import styled from "styled-components";
import { BaseStyles } from "../styles";
import { Routes } from "./Routes";

export const StyledRoutesContainer = styled.div`
  ${BaseStyles}
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const RoutesContainer = () => {
  const appLoading = useRefreshToken();

  if (appLoading) {
    return <LoadingPage />;
  }

  return (
    <StyledRoutesContainer>
      <Routes />
    </StyledRoutesContainer>
  );
};
