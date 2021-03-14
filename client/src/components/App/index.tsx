import * as React from "react";
import { RoutesContainer } from "../../RoutesContainer";
import { useTheme } from "../../hooks/useTheme";
import { ModalProvider } from "../context/ModalContext";
import { GlobalStyles } from "../../styled-components";

export const App = React.memo(() => {
  useTheme();

  return (
    <ModalProvider>
      <GlobalStyles />
      <RoutesContainer />
    </ModalProvider>
  );
});
