import * as React from "react";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { LoadingPage } from "../pages/LoadingPage";
import styled from "styled-components";
import { BaseStyles } from "../styles";
import { Routes } from "./Routes";

export const StyledRoutesContainer = styled.div`
  ${BaseStyles}
  flex-grow: 1;
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
