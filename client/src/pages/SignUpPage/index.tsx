import * as React from "react";
import { StyledContainer, StyledFormWrapper } from "../LoginPage";
import { JustifyCenter, StyledLink, SpanContainer } from "../../styles";
import { ReactComponent as Logo } from "../../components/svgs/Logo.svg";
import { Form } from "./Form";

export const SignUpPage: React.FC = () => (
  <StyledContainer>
    <JustifyCenter>
      <Logo />
    </JustifyCenter>
    <JustifyCenter>
      <SpanContainer bigger bolder>
        <span>Sign Up for Twitter</span>
      </SpanContainer>
    </JustifyCenter>
    <StyledFormWrapper>
      <Form />
    </StyledFormWrapper>
    <JustifyCenter>
      <StyledLink to="/login" $textunderline>
        <SpanContainer grey>
          <span>or, Log in</span>
        </SpanContainer>
      </StyledLink>
    </JustifyCenter>
  </StyledContainer>
);
