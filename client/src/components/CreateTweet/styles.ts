import { BaseStyles } from "../../styles";
import styled from "styled-components";

export const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  margin-top: 5px;
`;

export const StyledWrapper = styled.div`
  ${BaseStyles};
  color: var(--colors-maintext);
  flex-grow: 1;
  justify-content: flex-start;
  padding: 0 15px 15px 15px;
`;

export const StyledEditorContainer = styled.div`
  ${BaseStyles};
  padding: 10px 0;
`;

export const StyledEditorWrapper = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  width: 0px;
  > :first-child {
    flex-grow: 1;
    width: 0px;
    font-size: 19px;
  }
`;

export const StyledEmojiPickerContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 32px;
  height: 32px;
  justify-content: center;
  :hover {
    cursor: pointer;
    border-radius: 9999px;
    background-color: var(--colors-button-hover-opacity);
  }
`;

export const StyledToolbarContainer = styled.div`
  ${BaseStyles};
  align-items: center;
`;

export const StyledProgressCircleContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: flex-end;
  padding: 0 15px 1px 0;
`;
