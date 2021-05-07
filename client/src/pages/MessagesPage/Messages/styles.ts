import { Field } from "formik";
import styled, { css } from "styled-components";
import { BaseStyles } from "../../../styles";

export const StyledContainer = styled.div<{ height: number }>`
  ${BaseStyles};
  padding: 10px;
  flex-direction: column;
  overflow: auto;
  flex-direction: column-reverse;
  min-height: ${(props) => props.height - 109}px;
  max-height: ${(props) => props.height - 109}px;
  height: 700px;
  width: auto;
`;

export const InputContainer = styled(Field)`
  ${BaseStyles};
  border-width: 0px;
  display: none;
  border-style: inset;
  width: 100%;
  background-color: var(--colors-thirdbackground);
  outline: none;
  padding: 2px 10px 5px 10px;
  color: var(--colors-maintext);
  font-size: 19px;
`;

export const SpinnerContainer = styled.div`
  position: absolute;
  top: 15px;
  width: 45px;
  border-radius: 50%;
  height: 45px;
  display: flex;
  align-items: center;
  flex-basis: auto;
  left: 50%;
  background-color: black;
`;

export const StyledMessageContainer = styled.div<{
  isItMyMsg: boolean;
  margin: boolean;
  isItMyLastMsg: boolean;
}>`
  ${BaseStyles};
  align-items: center;
  margin-bottom: ${(props) => (props.isItMyLastMsg ? "10px" : "0")};
  margin-left: ${(props) => (props.margin ? "50px" : "0")};
  justify-content: ${(props) => (props.isItMyMsg ? "flex-end" : "flex-start")};
`;

export const StyledWrapper = styled.div<{ isItMyMsg: boolean }>`
  ${BaseStyles};
  flex-direction: column;
  max-width: 80%;
  width: 100%;
  align-items: ${(props) => (props.isItMyMsg ? "flex-end" : "flex-start")};
`;

export const StyledMessage = styled.div<{
  isItMyMsg: boolean;
  isEmojiOnly: boolean;
}>`
  ${({ isItMyMsg, isEmojiOnly }) => css`
    ${BaseStyles};
    max-width: 85%;
    border: 1px solid
      ${isItMyMsg && !isEmojiOnly
        ? "var(--colors-button)"
        : !isItMyMsg && !isEmojiOnly
        ? "var(--colors-thirdbackground)"
        : "transparent"};
    border-radius: 16px;
    background-color: ${isItMyMsg && !isEmojiOnly
      ? "var(--colors-button)"
      : !isItMyMsg && !isEmojiOnly
      ? "var(--colors-thirdbackground)"
      : "transparent"};
    border-bottom-left-radius: ${isItMyMsg ? "16px" : "0px"};
    border-bottom-right-radius: ${isItMyMsg ? "0px" : "16px"};
    padding: ${isEmojiOnly ? "0" : "10px"};
    margin: 0 5px 5px 5px;
    .emoji {
      width: ${isEmojiOnly ? "2.8em" : "1.2em"};
      height: ${isEmojiOnly ? "2.8em" : "1.2em"};
    }
  `}
`;

export const StyledFormArea = styled.div`
  ${BaseStyles};
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 10px 10px 5px 10px;
  border-top: 1px solid var(--colors-border);
  background-color: var(--colors-mainbackground);
`;

export const ChatBox = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  border-top: 1px solid var(--colors-border);
  border: 1px solid var(--colors-button);
  border-radius: 15px;
  background-color: var(--colors-thirdbackground);
  align-items: flex-end;
  justify-content: space-between;
  ::hover {
    cursor: text;
  }
  &:focus {
    background-color: var(--colors-mainbackground);
  }
`;

export const StyledEditorContainer = styled.div`
  ${BaseStyles};
  z-index: 0;
  display: flex;
  flex-grow: 1;
  padding: 5.5px;
  flex-direction: column;
  width: 0px;
  color: var(--colors-maintext);
  margin: 0px 10px;
  line-height: 1.3125;
  height: 100%;
  font-size: 15px;
  max-height: 125px;
  overflow-y: auto;
  overflow-wrap: break-word;
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
