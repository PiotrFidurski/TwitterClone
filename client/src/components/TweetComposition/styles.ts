import styled, { css } from "styled-components";
import { BaseStyles, PlaceHolder } from "../../styles";

export const Wrapper = styled.div<{ noBorder?: boolean }>`
  ${({ noBorder }) => css`
    ${BaseStyles};
    display: block;
    border-bottom: ${!noBorder && "1px solid var(--colors-border)"};
    overflow: hidden;
    flex-grow: 1;
    width: 100%;
    :hover {
      cursor: pointer;
      background-color: var(--colors-hover);
    }
  `}
`;

export const Content = styled.div`
  ${BaseStyles};
  flex-direction: column;
  padding-left: 15px;
  padding-right: 15px;
`;

export const StyledWrapper = styled.section`
  ${BaseStyles};
  padding-bottom: 10px;
  flex-direction: column;
  flex-basis: 0px;
  flex-grow: 1;
  width: 0px;
`;

export const HeaderContainer = styled.div`
  ${BaseStyles};
  align-items: center;
  margin-bottom: 2px;
  justify-content: space-between;
  flex-grow: 1;
`;

export const Header = styled.div`
  ${BaseStyles};
  flex-shrink: 1;
  align-items: baseline;
`;

export const StyledArticle = styled.article<{
  border?: boolean;
}>`
  ${({ border }) => css`
    ${BaseStyles};
    flex-direction: column;
    border-bottom: ${border && "1px solid var(--colors-border)"};
    overflow: hidden;
    flex-grow: 1;
    width: 100%;
  `}
`;

export const StyledTweetWrapper = styled.div<{ disableHover?: boolean }>`
  ${({ disableHover }) => css`
    ${BaseStyles};
    flex-direction: column;
    flex-grow: 1;
    :hover {
      ${!disableHover
        ? `cursor: pointer;
            background-color: var(--colors-hover);
            > ${PlaceHolder} {
              background-color: transparent;
            }`
        : null}
    }
    padding-left: 15px;
    padding-right: 15px;
  `}
`;

export const StyledAvatarWrapper = styled.div`
  ${BaseStyles};
  flex-basis: 49px;
  margin-right: 10px;
  flex-direction: column;
`;

export const StyledDetailsContainer = styled.div`
  ${BaseStyles};
  padding-bottom: 10px;
  flex-direction: column;
  flex-basis: 0px;
  width: 0px;
  flex-grow: 1;
`;

export const StyledHeaderContainer = styled.div`
  ${BaseStyles};
  margin-bottom: 2px;
  align-items: baseline;
  justify-content: space-between;
`;

export const StyledHeaderWrapper = styled.div`
  ${BaseStyles};
  flex-shrink: 1;
  align-items: baseline;
`;

export const StyledFooterWrapper = styled.div<{ marginAuto?: boolean }>`
  ${BaseStyles}
  margin: ${(props) => (props.marginAuto ? "10px auto" : "10px 0 0 0")};
  flex-basis: 85%;
  justify-content: space-between;
`;

export const StyledSpacingWrapper = styled.div`
  ${BaseStyles};

  flex-basis: 49px;
  margin-right: 10px;
  flex-direction: column;
`;

export const ShowMoreContainer = styled.div`
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

export const ShowMoreWrapper = styled.div`
  ${BaseStyles};
  margin: 5px 0;
`;

export const ThreadLineContainer = styled.div`
  ${BaseStyles};
  flex-direction: column;
  margin: 0px 5px;
  flex-basis: 70px;
  justify-content: space-between;
`;

export const Dot = styled.div`
  ${BaseStyles};
  width: 2px;
  height: 2px;
  background-color: var(--colors-threadedline);
  margin: 0 auto;
  flex-direction: column;
`;
