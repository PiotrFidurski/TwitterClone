import * as React from "react";
import { useParams, useHistory } from "react-router-dom";
import { AvatarContainer, StyledAvatar, Connector } from "../../styles";
import { useTweet } from "../TweetContext";
import { StyledAvatarWrapper } from "./styles";

export const Avatar: React.FC = () => {
  const { tweet } = useTweet();

  const { tweetId } = useParams<{ tweetId: string }>();

  const history = useHistory();

  const displayConnector =
    history.location.pathname.match(/(.user.*)/) || tweetId === tweet.id
      ? false
      : tweet.replyCount;

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
      {displayConnector ? <Connector /> : null}
    </StyledAvatarWrapper>
  );
};
