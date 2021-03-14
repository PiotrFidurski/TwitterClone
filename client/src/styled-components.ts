import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'system-ui', sans-serif;
    background: var(--colors-mainbackground);
    margin: 0;
  }
  button {
    font-family: 'system-ui', sans-serif;
  }
`;
