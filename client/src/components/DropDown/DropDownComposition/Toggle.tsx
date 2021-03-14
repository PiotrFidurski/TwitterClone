import * as React from "react";
import { useDropdownCtxt } from "../";
import { BaseStylesDiv } from "../../../styles";

export const Toggle: React.FC = ({ children }) => {
  const { open, ref } = useDropdownCtxt();

  return (
    <BaseStylesDiv
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();

        open();
      }}
    >
      {children}
    </BaseStylesDiv>
  );
};
