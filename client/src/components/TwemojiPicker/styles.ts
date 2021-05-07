import styled from "styled-components";
import { BaseStyles, BaseStylesDiv } from "../../styles";

export const StyledBody = styled.div`
  max-height: 300px;
  ${BaseStyles};
  padding: 10px 15px;
  flex-wrap: wrap;
`;

export const StyledPanelButton = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition: all 0.2s;
`;

export const StyledContainer = styled.div`
  ${BaseStylesDiv};
  flex-direction: column;
  flex-grow: 1;
`;
