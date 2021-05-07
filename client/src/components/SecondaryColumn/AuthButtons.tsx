import * as React from "react";
import { StyledLink, ButtonContainer, SpanContainer } from "../../styles";
import { StyledSecondaryContainer, StyledAuthButtonsWrapper } from "./styles";

export const AuthButtons: React.FC = () => (
  <StyledSecondaryContainer>
    <StyledAuthButtonsWrapper>
      <SpanContainer bolder bigger>
        <span>New to Twitter?</span>
      </SpanContainer>
      <SpanContainer grey smaller style={{ margin: "10px 0" }}>
        <span>Sign up now to get your own personalized timeline!</span>
      </SpanContainer>
      <StyledLink to="/register">
        <ButtonContainer filledVariant noMarginLeft>
          <div>
            <SpanContainer>
              <span>Sign up</span>
            </SpanContainer>
          </div>
        </ButtonContainer>
      </StyledLink>
      <StyledLink to="/login">
        <ButtonContainer noMarginLeft style={{ marginTop: "10px" }}>
          <div>
            <SpanContainer>
              <span>Log in</span>
            </SpanContainer>
          </div>
        </ButtonContainer>
      </StyledLink>
    </StyledAuthButtonsWrapper>
  </StyledSecondaryContainer>
);
