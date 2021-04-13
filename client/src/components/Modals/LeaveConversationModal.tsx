import * as React from "react";
import styled from "styled-components";
import { User } from "../../generated/graphql";
import {
  BaseStyles,
  BaseStylesDiv,
  ButtonContainer,
  JustifyCenter,
  SpanContainer,
} from "../../styles";
import { useModalContext } from "../context/ModalContext";
import { Modal } from "./ModalComposition/Modal";

interface Props {
  leaveConversation: () => void;
  user: User;
}

const StyledContainer = styled.div`
  ${BaseStyles}
  padding: 32px 20px 32px 20px;
  flex-grow: 1;
  flex-direction: column;
`;

export const LeaveConversationModal: React.FC<Props> = ({
  user,
  leaveConversation,
}) => {
  const { closeModal } = useModalContext();

  return (
    <Modal displayAsAlert>
      <Modal.Content>
        <StyledContainer>
          <BaseStylesDiv flexGrow>
            <JustifyCenter>
              <SpanContainer bigger bold>
                <span>Leave conversation?</span>
              </SpanContainer>
            </JustifyCenter>
          </BaseStylesDiv>
          <BaseStylesDiv flexGrow style={{ marginBottom: "10px" }}>
            <SpanContainer grey breakSpaces textCenter>
              <span>
                This conversation will be deleted from your inbox. Other people
                in the conversation will still be able to see it.
              </span>
            </SpanContainer>
          </BaseStylesDiv>
          <BaseStylesDiv>
            <ButtonContainer
              noMarginLeft
              grey
              style={{ minHeight: "35px" }}
              filledVariant
              onClick={closeModal}
            >
              <div>
                <SpanContainer>
                  <span>Cancel</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
            <ButtonContainer
              warning
              filledVariant
              style={{ minHeight: "35px" }}
              onClick={() => {
                leaveConversation();
                closeModal();
              }}
            >
              <div>
                <SpanContainer>
                  <span>Leave</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
          </BaseStylesDiv>
        </StyledContainer>
      </Modal.Content>
    </Modal>
  );
};
