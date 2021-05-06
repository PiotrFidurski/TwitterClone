import * as React from "react";
import { useTweet } from "../TweetContext";
import { ShowMore } from "./ShowMore";

export const ShowThread: React.FC = () => {
  const { tweet, prevTweet } = useTweet();

  return prevTweet &&
    prevTweet.conversationId === prevTweet.id &&
    prevTweet.id !== tweet.inReplyToId! &&
    prevTweet.conversationId! === tweet.conversationId! ? (
    <ShowMore tweet={tweet} isTweetView={false}>
      Show this thread
    </ShowMore>
  ) : null;
};
