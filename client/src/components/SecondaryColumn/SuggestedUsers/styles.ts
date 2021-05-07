import styled from "styled-components";
import { BaseStyles } from "../../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  background-color: var(--colors-background);
  display: block;
  border-radius: 14px;
  flex-direction: column;
  margin-bottom: 10px;
  border: 1px solid var(--colors-background);
`;

export const StyledHeader = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  flex-basis: 0px;
  align-items: center;
  justify-content: space-between;
`;
