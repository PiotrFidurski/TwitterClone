import * as React from "react";
import styled from "styled-components";
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
  deleteTweet: any;
}

const StyledContainer = styled.div`
  ${BaseStyles}
  padding: 32px 20px 32px 20px;
  flex-grow: 1;
  flex-direction: column;
`;

export const DeleteTweetModal: React.FC<Props> = ({ deleteTweet }) => {
  const { closeModal } = useModalContext();

  return (
    <Modal displayAsAlert>
      <Modal.Content>
        <StyledContainer>
          <BaseStylesDiv flexGrow>
            <JustifyCenter>
              <SpanContainer bigger bold>
                <span>Delete Tweet?</span>
              </SpanContainer>
            </JustifyCenter>
          </BaseStylesDiv>
          <BaseStylesDiv flexGrow style={{ marginBottom: "10px" }}>
            <SpanContainer grey breakSpaces textCenter>
              <span>
                This can’t be undone and it will be removed from your profile,
                the timeline of any accounts that follow you, and from Twitter
                search results.
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
                deleteTweet();
                closeModal();
              }}
            >
              <div>
                <SpanContainer>
                  <span>Delete</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
          </BaseStylesDiv>
        </StyledContainer>
      </Modal.Content>
    </Modal>
  );
};
