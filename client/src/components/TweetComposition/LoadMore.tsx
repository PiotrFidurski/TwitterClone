import * as React from "react";
import { Wrapper } from "./styles";
import {
  RepliesToTweetDocument,
  RepliesToTweetMutation,
} from "../../generated/graphql";
import { ShowMore } from "./ShowMore";
import { Tweet } from "../../generated/introspection-result";
import { Spinner } from "../../styles";
import { useMutation } from "@apollo/client";

interface Props {
  tweet: Tweet;
}

export const LoadMore: React.FC<Props> = ({ tweet }) => {
  const [{ loaded, loading }, setLoadings] = React.useState({
    loaded: false,
    loading: false,
  });

  const [load] = useMutation<RepliesToTweetMutation>(RepliesToTweetDocument, {
    variables: { tweetId: tweet.id },
  });

  const loadMore = React.useCallback(async (): Promise<any> => {
    try {
      await load({
        update: (cache, { data }) => {
          cache.modify({
            fields: {
              replies(existingReplies, { toReference, readField }) {
                const refArr =
                  data?.repliesToTweet.__typename === "RepliesToTweetSuccess"
                    ? data.repliesToTweet.edges!.map((tweet) => {
                        const ref = toReference(tweet);
                        return ref;
                      })
                    : [];

                return {
                  ...existingReplies,
                  edges: [...existingReplies.edges, ...refArr!],
                };
              },
            },
          });
        },
      });
    } catch (error) {}
  }, [load]);
  return (
    <Wrapper
      style={loaded ? { borderBottom: "transparent" } : {}}
      onClick={async (e) => {
        e.stopPropagation();

        try {
          setLoadings({ loaded: false, loading: true });
          await loadMore();
          setLoadings({ loaded: true, loading: false });
        } catch (e) {}
      }}
    >
      {!loading && !loaded ? (
        <ShowMore tweet={tweet} isTweetView={true}>
          more replies
        </ShowMore>
      ) : loading ? (
        <div>
          <Spinner style={{ margin: "10px auto" }} />
        </div>
      ) : null}
    </Wrapper>
  );
};
