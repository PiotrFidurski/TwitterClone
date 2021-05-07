import styled from "styled-components";
import { BaseStyles } from "../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  display: block;
  padding-top: 10px;
  background-color: var(--colors-mainbackground);
  min-height: 1080px;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const StyledWrapper = styled.div`
  ${BaseStyles};
  margin-top: 53px;
  position: sticky;
  top: 0;
  bottom: 0;
  flex-direction: column;
`;

export const StyledHoverWrapper = styled.div<{ hover?: boolean }>`
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
export const StyledSecondaryContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  background-color: var(--colors-background);
  display: block;
  border-radius: 14px;
  flex-direction: column;
  margin-bottom: 10px;
  border: 1px solid var(--colors-background);
`;

export const StyledAuthButtonsWrapper = styled.div`
  ${BaseStyles};
  flex-direction: column;
  padding: 10px;
  flex-grow: 1;
`;
