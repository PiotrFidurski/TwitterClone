import * as React from "react";
import {
  Dot,
  ShowMoreContainer,
  ShowMoreWrapper,
  ThreadLineContainer,
  Wrapper,
} from "./styles";
import {
  RepliesDocument,
  RepliesQuery,
  RepliesToTweetDocument,
  RepliesToTweetMutation,
  RepliesToTweetSuccess,
  TweetConnection,
} from "../../generated/graphql";
import { Tweet } from "../../generated/introspection-result";
import { SpanContainer, Spinner } from "../../styles";
import { useMutation } from "@apollo/client";

interface Props {
  tweet: Tweet;
}

export const ShowMoreReplies: React.FC<Props> = ({ tweet }) => {
  const [
    loadRepliesToTweet,
    { loading, called },
  ] = useMutation<RepliesToTweetMutation>(RepliesToTweetDocument, {
    variables: { tweetId: tweet.id },
  });

  const loadMore = React.useCallback(async (): Promise<any> => {
    try {
      await loadRepliesToTweet({
        update: (cache, { data }) => {
          const cachedReplies = cache.readQuery<RepliesQuery>({
            query: RepliesDocument,
            variables: { tweetId: tweet.conversationId },
          });

          cache.writeQuery<RepliesQuery>({
            query: RepliesDocument,
            variables: { tweetId: tweet.conversationId },
            data: {
              __typename: "Query",
              replies: {
                ...(cachedReplies?.replies as TweetConnection),
                edges: [
                  ...(cachedReplies?.replies as TweetConnection).edges!,
                  ...(data?.repliesToTweet as RepliesToTweetSuccess).edges!,
                ],
              },
            },
          });
        },
      });
    } catch (error) {}
  }, [loadRepliesToTweet, tweet]);

  return (
    <Wrapper
      style={called ? { borderBottom: "transparent" } : {}}
      onClick={async (e) => {
        e.stopPropagation();

        await loadMore();
      }}
    >
      {!called ? (
        <ShowMoreContainer>
          <ShowMoreWrapper>
            <ThreadLineContainer>
              <Dot />
              <Dot />
              <Dot />
            </ThreadLineContainer>
            <SpanContainer grey>
              <span style={{ color: "var(--colors-button)" }}>
                Show replies
              </span>
            </SpanContainer>
          </ShowMoreWrapper>
        </ShowMoreContainer>
      ) : loading ? (
        <Spinner style={{ margin: "10px auto" }} />
      ) : null}
    </Wrapper>
  );
};
