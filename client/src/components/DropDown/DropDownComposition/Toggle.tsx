import * as React from "react";
import { open, useDropdown } from "../context";
import { BaseStylesDiv } from "../../../styles";

export const Toggle: React.FC = ({ children }) => {
  const { dispatch, toggleRef } = useDropdown();

  return (
    <BaseStylesDiv
      ref={toggleRef}
      id="toggler"
      onClick={(e) => {
        e.stopPropagation();
        open(dispatch);
      }}
    >
      {children}
    </BaseStylesDiv>
  );
};
