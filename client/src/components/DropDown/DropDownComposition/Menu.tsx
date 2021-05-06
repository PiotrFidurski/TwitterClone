import * as React from "react";
import { useDropdownCtxt } from "../";
import ReactDOM from "react-dom";
import {
  StyledAbsoluteContainer,
  StyledFixedDiv,
  StyledContentsContainer,
} from "./styles";

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
