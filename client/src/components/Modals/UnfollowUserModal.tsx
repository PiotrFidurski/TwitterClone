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
import { useModal } from "../context/ModalContext";
import { Modal } from "./ModalComposition/Modal";

interface Props {
  unfollowUser: () => void;
  user: User;
}

const StyledContainer = styled.div`
  ${BaseStyles}
  padding: 32px 20px 32px 20px;
  flex-grow: 1;
  flex-direction: column;
`;

export const UnfollowUserModal: React.FC<Props> = ({ unfollowUser, user }) => {
  const { closeModal } = useModal();

  return (
    <Modal displayAsAlert>
      <Modal.Content>
        <StyledContainer>
          <BaseStylesDiv flexGrow>
            <JustifyCenter>
              <SpanContainer bigger bold>
                <span>Unfollow @{user!.username!}?</span>
              </SpanContainer>
            </JustifyCenter>
          </BaseStylesDiv>
          <BaseStylesDiv flexGrow style={{ marginBottom: "10px" }}>
            <SpanContainer grey breakSpaces textCenter>
              <span>
                Their Tweets will no longer show up in your home timeline. You
                can still view their profile, unless their Tweets are protected.
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
                unfollowUser();
                closeModal();
              }}
            >
              <div>
                <SpanContainer>
                  <span>Unfollow</span>
                </SpanContainer>
              </div>
            </ButtonContainer>
          </BaseStylesDiv>
        </StyledContainer>
      </Modal.Content>
    </Modal>
  );
};
