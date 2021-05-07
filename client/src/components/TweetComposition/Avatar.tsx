import * as React from "react";
import { useHistory } from "react-router-dom";
import { AvatarContainer, StyledAvatar, Connector } from "../../styles";
import { useTweet } from "../TweetContext";
import { StyledAvatarWrapper } from "./styles";

export interface AvatarProps {
  showThreadLine?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ children, showThreadLine }) => {
  const { tweet } = useTweet();

  const history: any = useHistory();

  const displayThreadLine =
    showThreadLine !== undefined ? showThreadLine : tweet.replyCount;

  return (
    <StyledAvatarWrapper>
      <AvatarContainer height="49px" width={49}>
        <StyledAvatar
          url={tweet!.owner!.avatar!}
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/user/${tweet.owner?.username}`);
          }}
        />
      </AvatarContainer>
      {displayThreadLine ? <Connector /> : children}
    </StyledAvatarWrapper>
  );
};
