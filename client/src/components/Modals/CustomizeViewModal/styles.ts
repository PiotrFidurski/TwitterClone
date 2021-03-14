import styled, { css } from "styled-components";
import {
  Absolute,
  BaseStyles,
  HoverContainer,
  InteractiveIcon,
} from "../../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  text-align: center;
  padding: 30px 30px 0 30px;
  flex-direction: column;
`;

export const ThemePickerContainer = styled.div`
  ${BaseStyles};
  width: 100%;
  flex-grow: 1;
  padding: 15px;
  margin-bottom: 15px;
  justify-content: space-around;
  background-color: rgb(25, 39, 52);
  border-radius: 15px;
`;

export const ColorPicker = styled.div<{ fill: string; currentColor: string }>`
  ${({ fill, currentColor }) => css`
    ${BaseStyles};
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    width: 45px;
    position: relative;
    height: 45px;
    background-color: ${fill};
    :hover {
      cursor: pointer;
    }
    &:after {
      content: "";
      position: absolute;
      width: 25px;
      height: 25px;
      background-image: ${currentColor === fill &&
      `url(
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' stroke='none' fill='white'><path d='M9 20c-.264 0-.52-.104-.707-.293l-4.785-4.785c-.39-.39-.39-1.023 0-1.414s1.023-.39 1.414 0l3.946 3.945L18.075 4.41c.32-.45.94-.558 1.395-.24.45.318.56.942.24 1.394L9.817 19.577c-.17.24-.438.395-.732.42-.028.002-.057.003-.085.003z'></path></svg>"
      )`};
    }
  `}
`;

export const ColorPickerWrapper = styled.div`
  ${BaseStyles};
  display: inline-block;
`;

export const Icon = styled.div<{ image: string }>`
  ${BaseStyles};
  background-image: ${(props) => `url(${props.image})`};
  width: 25px;
  height: 25px;
  background-repeat: no-repeat;
  margin: 10px auto 0 auto;
`;

export const ThemePicker = styled.div<{ fill: string; color?: string }>`
  ${({ fill, color }) => css`
    ${BaseStyles};
    border-radius: 5px;
    width: 30%;
    position: relative;
    height: 65px;
    padding: 0 15px;
    justify-content: flex-start;
    align-items: center;
    background-color: ${fill};
    :hover {
      cursor: pointer;
      ${InteractiveIcon} {
        > ${HoverContainer} {
          > ${Absolute} {
            background-color: ${color && color!.replace(/(\))/, ", ") + "0.1)"};
          }
        }
      }
    }
  `}
`;

export const CheckmarkContainer = styled.div`
  ${BaseStyles};
  border-radius: 9999px;
  padding: 10px;
  background: transparent;
`;

export const EmptyCircle = styled.div<{
  borderColor: string;
  background?: string;
}>`
  ${({ borderColor, background }) => css`
    ${BaseStyles};
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    border: 2px solid ${borderColor};
    background-color: ${background};
  `}
`;
