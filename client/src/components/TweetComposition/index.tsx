import * as React from "react";
import { useHistory } from "react-router-dom";
import { StyledArticle } from "./styles";
import { useTweet } from "../TweetContext";
import { ShowMoreReplies } from "./ShowMoreReplies";
import { Tweet as TweetType } from "../../generated/introspection-result";
import { ShowThread } from "./ShowThread";
import { Thread } from "./Thread";
import { Avatar } from "./Avatar";
import { Header, HeaderProps } from "./Header";
import { Footer, FooterProps } from "./Footer";
import { Body, BodyProps } from "./Body";
import { ReplyingTo } from "./ReplyingTo";

type TweetComposition = {
  ShowThread: React.FC;
  Thread: React.FC;
  Avatar: React.FC;
  Header: React.FC<HeaderProps>;
  ReplyingTo: React.FC;
  Body: React.FC<BodyProps>;
  Footer: React.FC<FooterProps>;
  ShowMoreReplies: React.FC<{
    tweet: TweetType;
  }>;
};

export const Tweet: React.FC & TweetComposition = ({ children }) => {
  const history = useHistory();

  const { tweet } = useTweet();

  const displayBorder =
    history.location.pathname === "/posts/compose"
      ? false
      : history.location.pathname.match(/(.user.*)/)
      ? true
      : !tweet.replyCount;

  const handleRedirect = (event: React.BaseSyntheticEvent) => {
    event.stopPropagation();
    if (!window.getSelection()!.toString())
      history!.push(`/${tweet.owner!.username}/status/${tweet!.id}`);
  };

  return (
    <StyledArticle border={!!displayBorder} onClick={handleRedirect}>
      {children}
    </StyledArticle>
  );
};

Tweet.ShowThread = ShowThread;
Tweet.Thread = Thread;
Tweet.Avatar = Avatar;
Tweet.Header = Header;
Tweet.ReplyingTo = ReplyingTo;
Tweet.Body = Body;
Tweet.Footer = Footer;
Tweet.ShowMoreReplies = ShowMoreReplies;
