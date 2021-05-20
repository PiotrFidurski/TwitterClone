import * as React from "react";
import { useModal } from "../../context/ModalContext";
import styled from "styled-components";
import { BaseStyles } from "../../../styles";

export const StyledContainer = styled.div`
  ${BaseStyles};
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid var(--colors-border);
  padding: 0 15px;
  height: 53px;
`;

export interface Props {
  children: ({ closeModal }: { closeModal: () => void }) => React.ReactNode;
}

export const Header: React.FC<Props> = ({ children }) => {
  const { closeModal } = useModal();

  return <StyledContainer>{children({ closeModal })}</StyledContainer>;
};
