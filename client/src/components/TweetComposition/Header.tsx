import * as React from "react";
import { BaseStylesDiv, SpanContainer, StyledLink } from "../../styles";
import { convertDateToTime } from "../../utils/functions";
import { useTweet } from "../TweetContext";
import { Menu } from "./Menu";
import { StyledHeaderContainer, StyledHeaderWrapper } from "./styles";

interface HeaderComposition {
  Menu: React.FC<any>;
}

export interface HeaderProps {
  displayDate?: boolean;
  flexColumn?: boolean;
}

export const Header: React.FC<HeaderProps> & HeaderComposition = ({
  children,
  displayDate,
  flexColumn,
}) => {
  const { tweet } = useTweet();

  return (
    <StyledHeaderContainer>
      <StyledHeaderWrapper>
        <BaseStylesDiv flexColumn={flexColumn} flexShrink>
          <SpanContainer marginRight>
            <StyledLink
              $textunderline
              onClick={(e) => e.stopPropagation()}
              id="_interactive-icon"
              to={`/user/${tweet!.owner!.username}`}
            >
              <SpanContainer bold style={{ flexShrink: 1 }}>
                <span>{tweet!.owner!.name}</span>
              </SpanContainer>
            </StyledLink>
          </SpanContainer>
          <SpanContainer grey style={{ flexShrink: 3 }}>
            <span>@{tweet!.owner!.username}</span>
          </SpanContainer>
        </BaseStylesDiv>
        {displayDate ? (
          <>
            <SpanContainer
              grey
              style={{ flexShrink: 0, padding: "0 5px 0 5px" }}
            >
              <span>·</span>
            </SpanContainer>

            <SpanContainer marginRight grey style={{ flexShrink: 0 }}>
              <span>{convertDateToTime(tweet)}</span>
            </SpanContainer>
          </>
        ) : null}
      </StyledHeaderWrapper>
      {children}
    </StyledHeaderContainer>
  );
};

Header.Menu = Menu;
