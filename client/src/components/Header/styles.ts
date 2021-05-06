import styled from "styled-components";
import { BaseStyles } from "../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--colors-border);
  z-index: 3;
  min-height: 53px;
  flex-direction: row;
  background-color: var(--colors-mainbackground);
`;

export const StyledWrapper = styled.div<{ flexStart?: boolean }>`
  ${BaseStyles};
  color: white;
  flex-grow: 1;
  margin: auto;
  align-items: center;
  justify-content: ${(props) =>
    props.flexStart ? "flex-start" : "space-between"};
  padding: 0 15px 0 15px;
`;
