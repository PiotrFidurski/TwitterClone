import * as React from "react";
import { BaseStyles, BaseStylesDiv, SpanContainer } from "../../styles";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Post } from "../../generated/graphql";

const StyledContainer = styled.div`
  ${BaseStyles};
  display: block;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
  :hover {
    cursor: pointer;
    background-color: var(--colors-hover);
  }
`;

const StyledWrapper = styled.div`
  ${BaseStyles};
  margin: 5px 0;
`;

const DottedThreadedLineContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  margin: 0px 5px;
  flex-basis: 70px;
  justify-content: space-between;
`;

const Dot = styled.div`
  ${BaseStyles};
  width: 2px;
  height: 2px;
  background-color: var(--colors-threadedline);
  margin: 0 auto;
  flex-direction: column;
`;

interface Props {
  post: Post;
  isPostView: boolean;
}

export const DisplayMoreButton: React.FC<Props> = React.memo(
  ({ post, children, isPostView }) => {
    let history = useHistory();

    const handleClick = (e: any) => {
      e.stopPropagation();
      history.push(`${post.owner!.username}/status/${post!.conversationId}`);
    };

    return (
      <BaseStylesDiv
        style={{ textDecoration: "none" }}
        onClick={(e) => {
          !isPostView && handleClick(e);
        }}
      >
        <StyledContainer>
          <StyledWrapper>
            <DottedThreadedLineContainer>
              <Dot />
              <Dot />
              <Dot />
            </DottedThreadedLineContainer>
            <SpanContainer grey bold>
              {children}
            </SpanContainer>
          </StyledWrapper>
        </StyledContainer>
      </BaseStylesDiv>
    );
  }
);
