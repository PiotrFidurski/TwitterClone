import styled, { css, keyframes } from "styled-components";
import { Form } from "formik";
import { Link } from "react-router-dom";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  };
  to {
    transform: rotate(360deg);
  }
`;

export const fade = keyframes`
  from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

export const BaseStyles = css`
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  padding: 0px;
  margin: 0px;
  border: 0 solid black;
  min-height: 0px;
  min-width: 0px;
  position: relative;
  z-index: 0;
  flex-shrink: 0;
  flex-basis: auto;
`;

export const TypographyStyles = css`
  box-sizing: border-box;
  color: rgba(0, 0, 0, 1);
  display: inline;
  margin: 0;
  padding: 0;
  line-height: 1.3125;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  white-space: pre-wrap;
  min-width: 0px;
  text-overflow: ellipsis;
`;

export const SpanContainer = styled.div<{
  bold?: boolean;
  grey?: boolean;
  padding?: boolean;
  bigger?: boolean;
  biggest?: boolean;
  smaller?: boolean;
  bolder?: boolean;
  marginRight?: boolean;
  marginLeft?: boolean;
  breakSpaces?: boolean;
  textCenter?: boolean;
}>`
  ${({
    bold,
    padding,
    marginRight,
    breakSpaces,
    grey,
    bolder,
    bigger,
    smaller,
    biggest,
    marginLeft,
    textCenter,
  }) => css`
    ${TypographyStyles};
    text-align: ${textCenter ? "center" : "start"};
    font-size: ${bigger
      ? "19px"
      : biggest
      ? "23px"
      : smaller
      ? "13px"
      : "15px"};
    color: ${grey ? "var(--colors-secondarytext)  " : "var(--colors-maintext)"};
    font-weight: ${bold ? "bold" : bolder ? 900 : 400};
    padding: ${padding ? "0 5px 0 5px" : 0};
    margin-right: ${marginRight ? "5px" : 0};
    white-space: nowrap;
    margin-left: ${marginLeft ? "20px" : 0};
    > span {
      white-space: ${breakSpaces ? "break-spaces" : "nowrap"};
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: inherit;
      color: inherit;
      font: inherit;
      line-height: inherit;
      word-wrap: inherit;
      overflow-wrap: inherit;
    }
    > a {
      text-decoration: none;
      color: inherit;
    }
  `}
`;

export const BaseStylesDiv = styled.div<{
  flexColumn?: boolean;
  flexShrink?: boolean;
  flexGrow?: boolean;
}>`
  ${BaseStyles};
  flex-direction: ${(props) => (props.flexColumn ? "column" : "row")};
  flex-shrink: ${(props) => (props.flexShrink ? 1 : 0)};
  flex-grow: ${(props) => (props.flexGrow ? 1 : 0)};
`;

export const StyledRoutesWrapper = styled.div`
  ${BaseStyles};
  color: white;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0;
`;

export const Absolute = styled.div<{
  noMargin?: boolean;
  biggerMargin?: boolean;
  noBorderRadius?: boolean;
}>`
  ${BaseStyles};
  ${({ noMargin, biggerMargin, noBorderRadius }) => css`
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border-radius: ${noBorderRadius ? "0" : "9999px"};
    margin: ${noMargin ? `0` : biggerMargin ? "-8px" : "-5px"};
  `}
`;

export const HoverContainer = styled.div<{ stretch?: boolean }>`
  ${BaseStyles};
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.stretch ? "100%" : "auto")};
  flex-grow: ${(props) => (props.stretch ? 1 : 0)};
  color: var(--colors-secondarytext);
  @media screen and (max-width: 1280px) {
    > div {
      ${SpanContainer} {
        display: none;
      }
    }
  }
  :hover {
    cursor: pointer;
    ${SpanContainer} {
      color: var(--colors-button);
    }
    color: var(--colors-button);
    ${Absolute} {
      background-color: var(--colors-button-hover-opacity);
      transition: background-color 0.3s ease;
    }
  }
`;

export const Main = styled.main`
  ${BaseStyles};
  flex-grow: 1;
  flex-shrink: 1;
  width: 990px;
  @media screen and (max-width: 1095px) {
    width: 920px;
  }
  @media screen and (max-width: 1005px) {
    width: 600px;
    flex-grow: 2;
  }
  @media screen and (max-width: 705px) {
    flex-shrink: 1;
    flex-grow: 1;
    width: 100%;
  }

  > :first-child {
    @media screen and (max-width: 1095px) {
      width: 920px;
    }
    @media screen and (max-width: 705px) {
      flex-grow: 1;
      width: 100%;
    }
    ${BaseStyles};
    width: 990px;
  }
`;

export const PrimaryColumn = styled.div`
  ${BaseStyles};
  max-width: 600px;
  flex-direction: column;
  animation-name: ${fade};
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.15s;
  height: max-content;
  flex-grow: 1;
  border-left: 1px solid var(--colors-border);
  border-right: 1px solid var(--colors-border);
`;

export const PlaceHolder = styled.div<{ noPadding?: boolean; light?: boolean }>`
  ${BaseStyles};
  background-color: ${(props) =>
    props.light ? "var(--colors-thirdbackground)" : `inherit`};
  padding-top: ${(props) => (props.noPadding ? "0" : "10px")};
`;

export const AvatarContainer = styled.div<{
  width: string | number;
  height: string;
  borderColor?: boolean;
  borderWidth?: boolean;
  marginTop?: string;
  noRightMargin?: boolean;
  displayAsGroup?: boolean;
}>`
  ${({
    borderColor,
    borderWidth,
    marginTop,
    noRightMargin,
    width,
    height,
    displayAsGroup,
  }) => css`
    ${BaseStyles};
    flex-grow: 0;
    width: ${width}px;
    margin-top: ${marginTop};
    border-width: ${borderWidth ? "4px" : "0"};
    min-height: ${height};
    flex-direction: row;
    height: 100%;
    flex-basis: ${!displayAsGroup ? width : (width as number) / 2}px;
    border-radius: ${!displayAsGroup ? "9999px" : "unset"};
    border-top-left-radius: ${displayAsGroup ? "9999px" : null};
    border-bottom-left-radius: ${displayAsGroup ? "9999px" : null};
    border-color: ${borderColor ? "rgb(21, 32, 43)" : "transparent"};
    margin-right: ${noRightMargin || displayAsGroup ? "0" : "10px"};
    ${StyledAvatar} {
      border-radius: ${displayAsGroup ? "inherit" : "9999px"};
    }
  `}
`;

interface StyledAvatarProps {
  url?: string | null | undefined;
}

export const StyledAvatar = styled.div<StyledAvatarProps>`
  ${({ url }) => css`
    ${BaseStyles};
    background-image: url("${url}");
    background: ${!url && "grey"};
    border-radius: 9999px;
    background-size: cover;
    background-color: var(--colors-thirdbackground);
    flex-grow: 1;
    cursor: pointer;
    flex-shrink: 0;
    transition: opacity 0.25s cubic-bezier(0.39, 0.575, 0.565, 1);
    :hover {
      opacity: 0.8;
    }
  `}
`;

export const Connector = styled.div<{ isReply?: boolean }>`
  ${BaseStyles};
  width: 2px;
  flex-grow: 1;
  background-color: var(--colors-threadedline);
  margin: ${(props) => (props.isReply ? "0 auto 5px auto" : "5px auto 0 auto")};
  flex-direction: column;
  min-height: 5px;
`;

export const SidebarColumn = styled.div`
  ${BaseStyles};
  width: 350px;
  margin-right: 10px;
  @media screen and (max-width: 1005px) {
    display: none;
  }
  @media screen and (max-width: 1095px) {
    width: 290px;
  }
`;

export const JustifyCenter = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: center;
  padding: 5px;
`;

export const ButtonContainer = styled.button<{
  filledVariant?: boolean;
  noMarginLeft?: boolean;
  bigger?: boolean;
  isFollowed?: boolean;
  warning?: boolean;
  grey?: boolean;
  noPadding?: boolean;
}>`
  ${({
    filledVariant,
    noMarginLeft,
    bigger,
    isFollowed,
    warning,
    grey,
    noPadding,
  }) => css`
    ${BaseStyles};
    background-color: ${filledVariant && !warning && !grey
      ? "var(--colors-button)"
      : filledVariant && grey && !warning
      ? "rgb(37, 51, 65)"
      : filledVariant && warning
      ? "rgb(224, 36, 94)"
      : "rgba(0, 0, 0, 0)"};

    border-radius: 9999px;
    border: 1px solid
      ${filledVariant && warning && !grey
        ? "rgb(224, 36, 94)"
        : filledVariant && !warning && grey
        ? "rgb(37, 51, 65)"
        : "var(--colors-button)"};
    min-width: ${!isFollowed ? "49px" : "101px"};
    min-height: ${bigger ? "49px" : "30px"};
    flex-grow: 1;
    margin-left: ${noMarginLeft ? "0" : "10px"};
    outline: none;
    &:disabled {
      opacity: 0.7;
    }
    > ${SpanContainer} {
      color: white;
    }
    :hover:not(:disabled) {
      cursor: pointer;
      border: ${isFollowed || warning || grey
        ? "1px solid transparent"
        : "1px solid var(--colors-button-hover)"};
      background-color: ${filledVariant && !isFollowed && !warning && !grey
        ? "var(--colors-button-hover)"
        : isFollowed
        ? "rgb(224, 36, 94)"
        : filledVariant && warning
        ? "rgb(202, 32, 85)"
        : filledVariant && grey
        ? "rgb(59, 71, 84)"
        : "var(--colors-button-hover-opacity)"};
      transition: background-color 0.3s ease;

      > :first-child {
        ${SpanContainer} {
          ::before {
            content: ${isFollowed
              ? `"Unfollow"`
              : isFollowed === undefined
              ? ""
              : `"Follow"`};
          }
          color: ${filledVariant ? "white" : "var(--colors-button)"};
          font-weight: bold;
        }
      }
    }

    :hover:disabled {
      cursor: not-allowed;
    }
    > :first-child {
      ${BaseStyles}
      min-height: inherit;
      height: 100%;
      text-align: center;
      max-width: -webkit-fill-available;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      padding: ${noPadding ? "0" : "0 1em"};
      overflow-wrap: break-word;
      ${SpanContainer} {
        ::before {
          content: ${isFollowed
            ? `"Following"`
            : isFollowed === undefined
            ? ""
            : `"Follow"`};
        }
        color: ${filledVariant ? "white" : "var(--colors-button)"};
        font-weight: bold;
      }
    }
  `}
`;

export const StyledForm = styled(Form)`
  ${BaseStyles};
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
`;

export const InteractiveIcon = styled.div<{
  isActive?: boolean;
  color?: string;
}>`
  ${({ isActive, color }) => css`
    ${BaseStyles};
    justify-content: flex-start;
    flex-grow: 1;
    align-items: center;
    flex-basis: 0px;
    :hover {
      > ${SpanContainer} {
        > span {
          color: ${color} !important;
        }
      }
    }
    > ${SpanContainer} {
      margin-left: 10px;
      color: ${isActive ? color : "rgb(136, 153, 166)"};
    }

    > ${HoverContainer} {
      > ${SpanContainer} {
        color: rgb(136, 153, 166);
        margin: 0 12px;
      }
      > a {
        > ${SpanContainer} {
          color: rgb(136, 153, 166);
          margin: 0 12px;
        }
      }
      :hover {
        > ${SpanContainer} {
          color: ${color} !important;
        }
        > div {
          > svg {
            fill: ${color};
          }
          > ${Absolute} {
            background-color: ${color && color!.replace(/(\))/, ", ") + "0.1)"};
          }
        }
        > a {
          > ${SpanContainer} {
            color: ${color};
          }
          > svg {
            fill: ${color};
          }
          > ${Absolute} {
            background-color: ${color && color!.replace(/(\))/, ", ") + "0.1)"};
          }
          > div {
            > svg {
              fill: ${color};
            }
            > ${Absolute} {
              background-color: ${color &&
              color!.replace(/(\))/, ", ") + "0.1)"};
            }
          }
        }
        > svg {
          fill: ${color};
        }
        > ${Absolute} {
          background-color: ${color && color!.replace(/(\))/, ", ") + "0.1)"};
        }
      }
    }
  `}
`;

export const StyledLink = styled(Link)<{ $textunderline?: boolean }>`
  display: flex;
  text-decoration: none;
  color: currentColor;
  flex-grow: 1;
  justify-content: flex-start;
  &:hover {
    text-decoration: ${(props) =>
      props.$textunderline ? "underline" : "none"};
    text-decoration-color: inherit;
  }
`;

export const Spinner = styled.div<{ bigMargin?: boolean }>`
  position: relative;
  margin: 60px auto;
  opacity: 1 !important;
  z-index: 9999;
  margin: ${(props) => props.bigMargin && "135px auto"};
  border-top: 4px solid rgba(244, 93, 34, 0.1);
  border-right: 4px solid rgba(244, 93, 34, 0.1);
  border-bottom: 4px solid rgba(244, 93, 34, 0.1);
  border-left: 4px solid var(--colors-button);
  width: 25px;
  height: 25px;
  animation: ${spin} 0.8s infinite linear;
  border-radius: 50%;
`;
