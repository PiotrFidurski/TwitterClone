import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import {
  Tweet,
  TweetConnection,
  TweetsInvalidInputError,
} from "./generated/graphql";

type CachedEdges = Array<Tweet & { __ref: string }>;

interface CachedTweetConnection extends TweetConnection {
  edges: CachedEdges;
}

const mergeTweets = (
  existing: TweetConnection = {
    count: 0,
    pageInfo: {
      startCursor: "",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: [],
  },
  incoming: TweetConnection | TweetsInvalidInputError = { message: "" }
) => {
  return incoming.__typename === "TweetConnection"
    ? {
        ...existing,
        __typename: "TweetConnection",
        pageInfo: incoming.pageInfo,
        count:
          existing && existing.count
            ? existing.count + incoming!.count!
            : incoming!.count,
        edges:
          existing && existing.edges
            ? Array.from(
                [...existing.edges, ...incoming.edges!]
                  .reduce(
                    (array, tweet: any) => array.set(tweet.__ref!, tweet),
                    new Map()
                  )
                  .values()
              )
            : incoming.edges,
      }
    : {
        __typename: "TweetsInvalidInputError",
        message: (incoming as TweetsInvalidInputError).message,
        after: (incoming as TweetsInvalidInputError).after,
        userId: (incoming as TweetsInvalidInputError).userId,
      };
};

const readMergeProfileTweets = {
  keyArgs: ["userId"],
  read(
    existing: TweetConnection = {
      count: 0,
      pageInfo: {
        startCursor: "",
        endCursor: "",
        hasNextPage: false,
        hasPreviousPage: false,
      },
      edges: [],
    }
  ) {
    return existing;
  },
  merge: mergeTweets,
};

interface Props {
  key: string;
  readField: ReadFieldFunction;
}

function arrayByKey(
  collection: Array<{ __ref: string }>,
  { ...props }: Props = {
    key: "",
    readField: () => {},
  }
) {
  const { key, readField } = props;
  const thread: Array<{ [key: string]: Tweet }> = [];
  if (key) {
    collection?.forEach((item) => {
      const field: string | undefined = readField(key, item);
      thread[field!] = item;
    });
    return thread;
  }
  collection?.forEach((item) => (thread[item.__ref] = item));
  return thread;
}

export { readMergeProfileTweets, mergeTweets, arrayByKey };

export type { CachedTweetConnection, CachedEdges };
