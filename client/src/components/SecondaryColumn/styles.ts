import styled from "styled-components";
import { BaseStyles } from "../../styles";

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

export const StyledWrapper = styled.div<{ hover?: boolean }>`
  ${BaseStyles};
  border-bottom: 1px solid var(--colors-border);
  padding: 10px 15px 10px 15px;
  flex-grow: 1;
  align-items: center;
  display: block;
  ${(props) =>
    props.hover &&
    `
    :hover {
    background-color: rgba(107, 125, 140, 0.1);
    cursor: pointer;
  }
  `}
`;

export const StyledHeader = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  flex-basis: 0px;
  align-items: center;
  justify-content: space-between;
`;
