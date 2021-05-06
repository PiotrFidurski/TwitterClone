import * as React from "react";
import styled from "styled-components";
import {
  BaseStyles,
  BaseStylesDiv,
  ButtonContainer,
  SpanContainer,
  StyledLink,
} from "../../styles";
import { Modal } from "./ModalComposition/Modal";

interface Props {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledContainer = styled.div`
  ${BaseStyles}
  padding: 32px 20px 32px 20px;
  flex-grow: 1;
  flex-direction: column;
`;

export const LoginModal: React.FC<Props> = ({ closeModal }) => {
  return (
    <Modal displayAsAlert>
      <Modal.Content>
        <StyledContainer>
          <BaseStylesDiv flexGrow>
            <SpanContainer bigger bold textCenter breakSpaces>
              <span>Get the best Twitter experience</span>
            </SpanContainer>
          </BaseStylesDiv>
          <BaseStylesDiv flexGrow style={{ marginBottom: "10px" }}>
            <SpanContainer grey breakSpaces textCenter>
              <span>Log in or sign up to get the best out of Twitter</span>
            </SpanContainer>
          </BaseStylesDiv>
          <BaseStylesDiv>
            <ButtonContainer
              noMarginLeft
              grey
              style={{ minHeight: "35px" }}
              filledVariant
              onClick={() => closeModal(false)}
            >
              <div>
                <SpanContainer>
                  <span>Cancel</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
            <StyledLink to="/login">
              <ButtonContainer
                filledVariant
                style={{ minHeight: "35px" }}
                onClick={() => {
                  closeModal(false);
                }}
              >
                <div>
                  <SpanContainer>
                    <span>Login</span>
                  </SpanContainer>
                </div>
              </ButtonContainer>
            </StyledLink>
          </BaseStylesDiv>
        </StyledContainer>
      </Modal.Content>
    </Modal>
  );
};
