import { InMemoryCache } from "@apollo/client";
import { Post } from "./generated/graphql";
import generatedIntrospection from "./generated/introspection-result";

export const cache: InMemoryCache = new InMemoryCache({
  possibleTypes: generatedIntrospection.possibleTypes,
  dataIdFromObject: (object: any) => object.id,
  typePolicies: {
    Query: {
      fields: {
        conversation: {
          keyArgs: ["conversationId", "postId"],
          read(existing, { toReference, readField, args }: any) {
            const thread: Array<{ [key: string]: Post }> = [];

            existing &&
              existing.length &&
              existing.forEach((post: any) => (thread[post.__ref] = post));
            const ref = toReference(args.postId);
            const inReplyToId = readField("inReplyToId", ref);

            let array =
              existing &&
              existing.filter((post: any) => post.__ref === inReplyToId);

            const findMore = (post: any) => {
              if (post) {
                post && array!.unshift(post);
                const ref = toReference(post);
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

            return array;
          },
        },
        replies: {
          keyArgs: ["postId"],
          read(existing, { toReference, readField, args }: any) {
            const thread: Array<{ [key: string]: Post }> = [];

            existing &&
              existing.length &&
              existing.forEach((reply: any) => {
                const ref = toReference(reply);
                const inReplyToId = readField("inReplyToId", ref);
                return (thread[inReplyToId] = reply);
              });

            let array =
              existing &&
              existing.length &&
              existing!.filter((reply: any) => {
                const ref = toReference(reply);
                const field = readField("inReplyToId", ref);

                return field === args.postId;
              });

            existing &&
              existing.slice(0).forEach((reply: any) => {
                let child = thread[reply.__ref];

                let idx = array.indexOf(reply);
                if (child) {
                  array.splice(idx + 1, 0, child);
                }
              });

            return array;
          },
          merge(existing = [], incoming, { args }: any) {
            return Array.from(
              [...existing, ...incoming]
                .reduce((array, item) => array.set(item.__ref, item), new Map())
                .values()
            );
          },
        },
        feed: {
          keyArgs: [],
          read(existing, { toReference, readField, args }) {
            let thread: Array<{ [key: string]: Post }> = [];
            existing &&
              existing.feed &&
              existing.feed.forEach((item: any) => (thread[item.__ref] = item));
            let array =
              existing &&
              existing.feed &&
              existing.feed.filter((item: any) => {
                const ref = toReference(item);
                const field = readField("replyCount", ref);
                return !field;
              });

            existing &&
              existing.feed &&
              existing.feed.slice(0).forEach((post: any) => {
                const ref = toReference(post);
                const inReplyToId: any = readField("inReplyToId", ref);
                let parent: any = thread[inReplyToId];
                if (parent && !array!.includes(parent)) {
                  const idx = array!.indexOf(post);
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
            return { ...existing, feed: array };
          },
          merge(existing = [], incoming) {
            console.log(existing, "existing", incoming, "inc");
            return {
              ...existing,
              length:
                existing && existing!.feed
                  ? existing!.length + incoming!.length
                  : incoming!.length,
              feed:
                existing.length && existing.feed
                  ? Array.from(
                      [...existing!.feed!, ...incoming.feed!]
                        .reduce(
                          (array, item) => array.set(item.__ref, item),
                          new Map()
                        )
                        .values()
                    )
                  : incoming.feed!,
            };
          },
        },
      },
    },
  },
});
