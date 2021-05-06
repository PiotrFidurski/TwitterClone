import styled from "styled-components";
import {
  BaseStyles,
  ButtonContainer,
  SpanContainer,
  HoverContainer,
} from "../../styles";
import { Link } from "react-router-dom";
import { StyledDropDownItem } from "../DropDown/DropDownComposition/styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: flex-end;
  height: auto;
  width: 275px;
  ${ButtonContainer} {
    > :first-child {
      > svg {
        display: none;
      }
    }
  }
  @media screen and (max-width: 1280px) {
    width: 88px;
    ${ButtonContainer} {
      > :first-child {
        > svg {
          display: inline-block;
        }
        ${SpanContainer} {
          display: none;
        }
      }
    }
  }
  @media screen and (max-width: 560px) {
    width: 68px;
  }
`;

export const FixedContainer = styled.div`
  ${BaseStyles};
  position: fixed;
  top: 0;
  height: 100%;
`;

export const StyledWrapper = styled.div`
  ${BaseStyles};
  width: 275px;
  padding-right: 20px;
  overflow: auto;
  padding-left: 20px;
  height: 100%;
  align-items: flex-start;
  @media screen and (max-width: 1280px) {
    width: 88px;
  }
  @media screen and (max-width: 560px) {
    padding-left: 10px;
    padding-right: 10px;
    width: 68px;
  }
`;

export const NavContainer = styled.div`
  ${BaseStyles};
  margin-top: 5px;
  margin-bottom: 5px;
  flex-direction: column;
  justify-content: center;
`;

export const NavLink = styled(Link)`
  ${BaseStyles};
  outline-style: none;
  cursor: pointer;
  justify-content: flex-start;
  width: 100%;
  text-decoration: none;
  flex-direction: row;
  ${HoverContainer} {
    > svg {
      fill: var(--colors-button);
    }
  }
  @media screen and (max-width: 1280px) {
    ${HoverContainer} {
      ${SpanContainer} {
        display: none;
      }
    }
  }
  ${StyledDropDownItem} {
    padding: 15px;
    border-radius: 0px;
    justify-content: flex-start;
  }
  ${HoverContainer} {
    ${BaseStyles};
    align-items: center;
    justify-content: center;
    max-width: 100%;
    padding: 10px;
    border-radius: 9999px;
  }
`;
export const StyledNotification = styled.div`
  ${BaseStyles};
  position: absolute;
  top: 3px;
  display: flex !important;
  justify-content: center;
  text-align: center;
  border-radius: 9999px;
  height: 20px;
  width: 20px;
  font-size: 11px;
  align-items: center;
  box-shadow: -1px 1px 1px 1px var(--colors-mainbackground);
  color: white;
  left: 28px;
  background-color: var(--colors-button);
  right: 0px;
`;
