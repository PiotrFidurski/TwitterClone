import * as React from "react";
import { useDropdownCtxt } from "../";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { BaseStyles, SpanContainer } from "../../../styles";

export const StyledContentsContainer = styled.div<{
  position: string;
  dimensions: DOMRectReadOnly;
  visible: boolean;
}>`
  ${BaseStyles};
  min-height: 25px;
  box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px,
    rgb(101 119 134 / 15%) 0px 0px 3px 1px;
  position: ${(props) => props.position};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  min-width: fit-content;
  overflow: hidden;
  top: ${(props) => (props.dimensions ? props.dimensions.top : "10")}px;
  left: ${(props) => (props.dimensions ? props.dimensions.left : "10")}px;
  border-radius: 5px;
  background: var(--colors-mainbackground);
`;

export const StyledAbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

export const StyledFixedDiv = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

export const StyledDropDownItem = styled.div<{
  danger?: boolean;
  noPadding?: boolean;
}>`
  ${BaseStyles};
  justify-content: flex-start;
  overflow: hidden;
  overflow-y: auto;
  align-items: center;
  min-width: 220px;
  flex-grow: 1;
  padding: ${(props) => (props.noPadding ? "0" : "15px")};
  color: ${(props) =>
    props.danger ? "rgb(224, 36, 94)" : "var(--colors-maintext)"};
  ${SpanContainer} {
    color: inherit;
    pointer-events: none;
    > span {
      color: inherit;
      pointer-events: none;
    }
  }
  > svg {
    margin-right: 10px;
    pointer-events: none;
    fill: ${(props) =>
      props.danger ? "rgb(224, 36, 94)" : "var(--colors-secondarytext)"};
    height: 1.25rem;
  }
  :hover {
    cursor: pointer;
    background-color: var(--colors-hover);
  }
`;

export const Menu: React.FC = ({ children }) => {
  const { state, close, position, menuRef } = useDropdownCtxt();

  React.useEffect(() => {
    const handleClose = (e: any) => {
      if (menuRef.current && !menuRef.current!.contains(e.target)) {
        close();
      }
    };
    window.addEventListener("mousedown", handleClose);
    return () => window.removeEventListener("mousedown", handleClose);
  }, [close, menuRef]);

  return ReactDOM.createPortal(
    state && state.open ? (
      <StyledAbsoluteContainer>
        <StyledFixedDiv />
        <StyledAbsoluteContainer />
        <StyledContentsContainer
          ref={menuRef}
          visible={state.visible}
          position={position}
          dimensions={{
            ...state.dimensions!,
            top:
              position === "fixed"
                ? state.dimensions!.y
                : state.dimensions!.top,
          }}
        >
          {children}
        </StyledContentsContainer>
      </StyledAbsoluteContainer>
    ) : null,
    document.getElementById("root")!
  );
};
