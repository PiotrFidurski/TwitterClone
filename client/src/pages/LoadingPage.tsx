import * as React from "react";
import { Absolute, BaseStyles } from "../styles";
import { ReactComponent as Logo } from "../components/svgs/Logo.svg";
import styled from "styled-components";

interface Props {}

const StyledContainer = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  min-height: 600px;
`;

export const LoadingPage: React.FC<Props> = () => {
  return (
    <StyledContainer>
      <Absolute style={{ top: "50%", left: "50%" }}>
        <Logo />
      </Absolute>
    </StyledContainer>
  );
};
