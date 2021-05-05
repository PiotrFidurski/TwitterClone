import styled from "styled-components";
import { BaseStyles } from "../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  height: auto;
  justify-content: stretch;
  flex-shrink: 1;
  width: 100%;
  border-left: 1px solid var(--colors-border);
`;

export const StyledWrapper = styled.div<{ location: string }>`
  ${BaseStyles};
  flex-direction: column;
  flex: 1 1 0%;
  max-width: 600px;
  @media only screen and (max-width: 1010px) {
    ${(props) =>
      props.location === "/messages" ? "flex: 1 1 0%;" : "flex: 0 1 0%"};
  }
`;

export const StyledConversationContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  overflow: auto;
  position: absolute;
  top: 53px;
  left: 0;
  right: 0;
  bottom: 0;
  flex-shrink: 1;
`;

export const StyledMessagesContainer = styled.div<{ location: string }>`
  ${BaseStyles};
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid var(--colors-border);
  max-width: 600px;
  flex: 1.54 1 0%;
  width: 0px;
  @media only screen and (max-width: 1010px) {
    ${(props) =>
      props.location === "/messages" ? "flex: 0 1 0%;" : "flex: 1.54 1 0%"};
  }
  border-left: 1px solid var(--colors-border);
`;
