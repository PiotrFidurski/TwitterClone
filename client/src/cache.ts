import { InMemoryCache, makeVar } from "@apollo/client";
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
          read(existing = false, { cache, readField, toReference }) {
            const followers: any = readField("followers");
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
          keyArgs: false,
          merge: false,
          read(existing) {
            return existing;
          },
        },
        isLiked: {
          read(existing = false, { cache, readField, toReference }) {
            const likes: any = readField("likes");

            const isLiked = likes!.filter((user: any) => {
              return user.__ref === authUserId();
            }).length;
            return likes.length ? !!isLiked : existing;
          },
        },
        inReplyToUsername: {
          read(existing = "", { readField, toReference }) {
            const field: any = readField("inReplyToId");
            const ref = toReference({ id: field!, __typename: "Tweet" });
            const owner: any = readField("owner", ref);
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
          read(existing, { toReference, readField, args }: any) {
            const thread: Array<{ [key: string]: Tweet }> = [];
            existing &&
              existing.edges &&
              existing.edges.forEach(
                (tweet: any) => (thread[tweet.__ref] = tweet)
              );
            const ref = toReference(args.tweetId);
            const inReplyToId = readField("inReplyToId", ref);
            let array =
              existing &&
              existing.edges &&
              existing.edges.filter(
                (tweet: any) => tweet.__ref === inReplyToId
              );
            const findMore = (tweet: any) => {
              if (tweet) {
                tweet && array!.unshift(tweet);
                const ref = toReference(tweet);
                const inReplyToId = readField("inReplyToId", ref);
                findMore(thread[inReplyToId]);
              }
            };
            if (array && array.length) {
              array.slice(0).forEach((post: any) => {
                const ref = toReference(post);
                const inReplyToId = readField("inReplyToId", ref);
                let parent: any = thread[inReplyToId];
                if (!array!.includes(parent)) {
                  findMore(parent!);
                }
              });
            }
            return { ...existing, edges: array };
          },
        },
        replies: {
          keyArgs: ["tweetId"],
          read(existing, { toReference, readField, args }: any) {
            const thread: Array<{ [key: string]: Tweet }> = [];
            existing &&
              existing.edges &&
              existing.edges.forEach((reply: any) => {
                const inReplyToId = readField("inReplyToId", reply);
                return (thread[inReplyToId] = reply);
              });
            let array =
              existing &&
              existing.edges &&
              existing!.edges.filter((reply: any) => {
                const ref = toReference(reply);
                const field = readField("inReplyToId", ref);
                return field === args.tweetId;
              });
            existing &&
              existing.edges &&
              existing.edges.slice(0).forEach((reply: any) => {
                let child = thread[reply.__ref];
                let idx = array.indexOf(reply);
                if (child) {
                  array.splice(idx + 1, 0, child);
                }
              });

            return existing && { ...existing, edges: array };
          },
          merge(existing = {}, incoming = {}, { args }: any) {
            return incoming.__typename !== "TweetsInvalidInputError"
              ? {
                  ...existing,
                  __typename: "TweetConnection",
                  pageInfo: incoming.pageInfo,
                  count:
                    existing && existing.count
                      ? existing.count + incoming.count
                      : incoming.count,
                  edges:
                    existing && existing.edges
                      ? Array.from(
                          [...existing.edges, ...incoming.edges]
                            .reduce(
                              (array, tweet) => array.set(tweet.__ref, tweet),
                              new Map()
                            )
                            .values()
                        )
                      : incoming.edges,
                }
              : {
                  __typename: "TweetsInvalidInputError",
                  message: incoming.message,
                  cursorId: incoming.cursorId,
                  tweetId: incoming.tweetId,
                };
          },
        },
        feed: {
          read(existing, { toReference, readField }) {
            let thread: Array<{ [key: string]: Tweet }> = [];

            existing &&
              existing.edges &&
              existing.edges.forEach((tweet: any) => {
                return (thread[tweet.__ref] = tweet);
              });

            let array =
              existing &&
              existing.edges &&
              existing.edges.filter((tweet: any) => {
                const ref: any = toReference(tweet);

                const field = readField("replyCount", ref);

                return !field;
              });

            array &&
              array!.length &&
              array!.slice(0).forEach((tweet: any) => {
                const ref: any = toReference(tweet);

                const inReplyToId: any = readField("inReplyToId", ref);

                let parent: any = thread[inReplyToId];

                if (parent && !array!.includes(parent)) {
                  const idx = array!.indexOf(tweet);

                  array!.splice(idx, 0, parent);
                  const ref = toReference(parent);
                  const replyId = readField("inReplyToId", ref);
                  const conversationId: any = readField("conversationId", ref);
                  if (replyId && !array!.includes(thread[conversationId])) {
                    const idx = array!.indexOf(parent);
                    array!.splice(idx, 0, thread[conversationId]);
                  }
                }
              });

            return { ...existing, edges: array };
          },
          merge(existing = {}, incoming = {}) {
            return {
              ...existing,
              pageInfo: incoming.pageInfo,
              count:
                existing && existing.count
                  ? existing.count + incoming.count
                  : incoming.count,
              edges:
                existing && existing.edges
                  ? [...existing.edges, ...incoming.edges]
                  : incoming.edges,
            };
          },
        },
        userTweets: {
          keyArgs: ["userId"],
          read(existing = {}) {
            return existing;
          },
          merge(existing = [], incoming) {
            return incoming.__typename !== "TweetsInvalidInputError"
              ? {
                  ...existing,
                  __typename: "TweetConnection",
                  pageInfo: incoming.pageInfo,
                  count:
                    existing && existing.count
                      ? existing.count + incoming.count
                      : incoming!.count,
                  edges:
                    existing && existing.edges
                      ? [...existing!.edges!, ...incoming.edges!]
                      : incoming!.edges!,
                }
              : {
                  __typename: "TweetsInvalidInputError",
                  message: incoming.message,
                  after: incoming.after,
                  userId: incoming.userId,
                };
          },
        },
        userLikedTweets: {
          keyArgs: ["userId"],
          read(existing = {}) {
            return existing;
          },
          merge(existing = {}, incoming) {
            return incoming.__typename !== "TweetsInvalidInputError"
              ? {
                  ...existing,
                  __typename: "TweetConnection",
                  pageInfo: incoming.pageInfo,
                  count:
                    existing && existing.count
                      ? existing.count + incoming.count
                      : incoming!.count,
                  edges:
                    existing && existing.edges
                      ? [...existing!.edges!, ...incoming.edges!]
                      : incoming!.edges!,
                }
              : {
                  __typename: "TweetsInvalidInputError",
                  message: incoming.message,
                  after: incoming.after,
                  userId: incoming.userId,
                };
          },
        },
        userTweetsAndReplies: {
          keyArgs: ["userId"],
          read(existing = {}) {
            return existing;
          },
          merge(existing = [], incoming) {
            return incoming.__typename !== "TweetsInvalidInputError"
              ? {
                  ...existing,
                  __typename: "TweetConnection",
                  pageInfo: incoming.pageInfo,
                  count:
                    existing && existing.count
                      ? existing.count + incoming.count
                      : incoming!.count,
                  edges:
                    existing && existing.edges
                      ? [...existing!.edges!, ...incoming.edges!]
                      : incoming!.edges!,
                }
              : {
                  __typename: "TweetsInvalidInputError",
                  message: incoming.message,
                  after: incoming.after,
                  userId: incoming.userId,
                };
          },
        },
      },
    },
  },
});

export const authUserId = makeVar("");
