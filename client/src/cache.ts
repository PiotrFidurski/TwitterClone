import { InMemoryCache, makeVar } from "@apollo/client";
import {
  arrayByKey,
  CachedEdges,
  CachedTweetConnection,
  mergeTweets,
  readMergeProfileTweets,
} from "./cacheHelpers";
import { Tweet } from "./generated/graphql";
import generatedIntrospection from "./generated/introspection-result";

export const cache: InMemoryCache = new InMemoryCache({
  possibleTypes: generatedIntrospection.possibleTypes,
  dataIdFromObject: (object: any) => {
    return object.id;
  },
  typePolicies: {
    User: {
      fields: {
        isFollowed: {
          read(existing = false, { readField, toReference }) {
            const followers: readonly any[] | undefined =
              readField("followers");
            return (
              !!followers?.filter((user: any) => {
                const ref = toReference(user);
                const id = readField("id", ref);
                return id === authUserId();
              }).length || existing
            );
          },
        },
      },
    },
    Tweet: {
      fields: {
        likes: {
          merge: false,
          read(existing) {
            return existing;
          },
        },
        isLiked: {
          read(existing = false, { cache, readField, toReference }) {
            const likes: readonly any[] | undefined = readField("likes");

            const isLiked = likes!.filter((user: any) => {
              return user.__ref === authUserId();
            }).length;
            return likes?.length ? !!isLiked : existing;
          },
        },
        inReplyToUsername: {
          read(existing = "", { readField, toReference }) {
            const field: any = readField("inReplyToId");

            const ref = toReference({ id: field!, __typename: "Tweet" });

            const owner: any = readField("owner", ref!);

            const username = readField("username", owner);
            return username ? username : existing;
          },
        },
      },
    },
    Query: {
      fields: {
        messages: {
          keyArgs: ["conversationId", "leftAtMessageId"],
          read(existing) {
            return existing;
          },
          merge(existing = {}, incoming = {}) {
            return incoming.__typename !== "MessagesInvalidInputError"
              ? {
                  ...existing,
                  __typename: incoming.__typename,
                  pageInfo: incoming.pageInfo,
                  conversation: incoming.conversation,
                  edges:
                    existing && existing.edges
                      ? [...incoming.edges, ...existing.edges]
                      : incoming.edges,
                }
              : {
                  conversationId: incoming.conversationId,
                  cursorId: incoming.cursorId,
                  leftAtMessageId: incoming.leftAtMessageId,
                  limit: incoming.limit,
                  message: incoming.message,
                  __typename: "MessagesInvalidInputError",
                };
          },
        },
        conversation: {
          keyArgs: ["conversationId", "tweetId"],
          read(
            existing: { edges: CachedEdges } = { edges: [] },
            { toReference, readField, args }
          ) {
            const thread = arrayByKey(existing?.edges!);

            const ref = toReference(args!.tweetId);

            const inReplyToId: string | undefined = readField(
              "inReplyToId",
              ref
            );

            const array =
              existing &&
              existing.edges &&
              existing.edges.filter((tweet) => tweet.__ref === inReplyToId);

            const findMore = (tweet: Tweet & { __ref: string }) => {
              if (tweet) {
                tweet && array!.unshift(tweet);

                const ref = toReference(tweet);

                const inReplyToId = readField("inReplyToId", ref);

                findMore(thread[inReplyToId as string]);
              }
            };
            if (array && array.length) {
              array.slice(0).forEach((tweet) => {
                const ref = toReference(tweet);

                const inReplyToId = readField("inReplyToId", ref);

                let parent = thread[inReplyToId as string];

                if (!array!.includes(parent)) {
                  findMore(parent!);
                }
              });
            }
            return { ...existing, edges: array };
          },
        },
        replies: {
          keyArgs: ["tweetId", "inReplyToId"],
          read(
            existing: CachedTweetConnection,
            { toReference, readField, args }
          ) {
            const thread = arrayByKey(existing?.edges!, {
              key: "inReplyToId",
              readField,
            });

            const array =
              existing &&
              existing.edges &&
              existing!.edges.filter((reply) => {
                const ref = toReference(reply);

                const field = readField("inReplyToId", ref);

                return field === args!.tweetId;
              });

            existing &&
              existing.edges &&
              existing.edges.slice(0).forEach((reply) => {
                let child = thread[reply.__ref];

                let idx = array!.indexOf(reply);

                if (child && !array!.includes(child)) {
                  array!.splice(idx + 1, 0, child);
                }
              });

            return existing && { ...existing, edges: array };
          },
          merge: mergeTweets,
        },
        feed: {
          read(existing: CachedTweetConnection, { toReference, readField }) {
            const thread = arrayByKey(existing?.edges!);

            const array =
              existing &&
              existing.edges &&
              existing.edges.filter((tweet) => {
                const ref = toReference(tweet);

                const field = readField("replyCount", ref);

                return !field;
              });

            array &&
              array!.length &&
              array!.slice(0).forEach((tweet) => {
                const ref = toReference(tweet);

                const inReplyToId = readField("inReplyToId", ref);

                const parent = thread[inReplyToId as string];

                if (parent && !array!.includes(parent)) {
                  const idx = array!.indexOf(tweet);

                  array!.splice(idx, 0, parent);

                  const ref = toReference(parent);

                  const replyId = readField("inReplyToId", ref);

                  const conversationId = readField("conversationId", ref);

                  if (
                    replyId &&
                    !array!.includes(thread[conversationId as string])
                  ) {
                    const idx = array!.indexOf(parent);
                    array!.splice(idx, 0, thread[conversationId as string]);
                  }
                }
              });

            return { ...existing, edges: array };
          },
          merge: mergeTweets,
        },
        userTweets: readMergeProfileTweets,
        userLikedTweets: readMergeProfileTweets,
        userTweetsAndReplies: readMergeProfileTweets,
      },
    },
  },
});

export const authUserId = makeVar("");
