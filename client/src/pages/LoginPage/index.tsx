import * as React from "react";
import { Form } from "./Form";
import {
  JustifyCenter,
  StyledLink,
  SpanContainer,
  BaseStyles,
} from "../../styles";
import { ReactComponent as Logo } from "../../components/svgs/Logo.svg";
import styled from "styled-components";

export const StyledContainer = styled.div`
  ${BaseStyles};
  max-width: 600px;
  padding: 15px;
  flex-grow: 1;
  margin: 0 auto;
  flex-direction: column;
`;

export const StyledFormWrapper = styled.div`
  ${BaseStyles};
  padding-top: 15px;
`;

export const LoginPage: React.FC = () => {
  return (
    <StyledContainer>
      <JustifyCenter>
        <Logo />
      </JustifyCenter>
      <JustifyCenter>
        <SpanContainer bigger bolder>
          <span>Log in to Twitter</span>
        </SpanContainer>
      </JustifyCenter>
      <StyledFormWrapper>
        <Form />
      </StyledFormWrapper>
      <JustifyCenter>
        <StyledLink to="/register" $textunderline>
          <SpanContainer grey>
            <span>Sign up for twitter</span>
          </SpanContainer>
        </StyledLink>
      </JustifyCenter>
    </StyledContainer>
  );
};
