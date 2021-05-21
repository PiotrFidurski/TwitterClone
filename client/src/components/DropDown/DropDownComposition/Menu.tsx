import * as React from "react";
import { close, useDropdown } from "../context";
import ReactDOM from "react-dom";
import {
  StyledAbsoluteContainer,
  StyledFixedDiv,
  StyledContentsContainer,
} from "./styles";
import { BaseStylesDiv } from "../../../styles";

interface Props {
  position: string;
}

export const Menu: React.FC<Props> = ({ children, position }) => {
  const { state, menuRef, dispatch } = useDropdown();

  const handleClose = (e: React.BaseSyntheticEvent) => {
    if (!menuRef?.current?.contains(e.target)) {
      close(dispatch);
    }
  };

  return ReactDOM.createPortal(
    state?.open ? (
      <StyledAbsoluteContainer>
        <StyledFixedDiv onClick={handleClose} id="_Dropdown_backdrop" />
        <StyledAbsoluteContainer />
        <StyledContentsContainer
          ref={menuRef}
          position={position}
          dimensions={state.dimensions!}
        >
          <BaseStylesDiv>
            <BaseStylesDiv flexColumn onClick={(e) => e.stopPropagation()}>
              {children}
            </BaseStylesDiv>
          </BaseStylesDiv>
        </StyledContentsContainer>
      </StyledAbsoluteContainer>
    ) : null,
    document.getElementById("root")!
  );
};
