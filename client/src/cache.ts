import { InMemoryCache, makeVar } from "@apollo/client";
import { Conversation, Post } from "./generated/graphql";
import generatedIntrospection from "./generated/introspection-result";

export const cache: InMemoryCache = new InMemoryCache({
  possibleTypes: generatedIntrospection.possibleTypes,
  dataIdFromObject: (object: any) => object.id,
  typePolicies: {
    Query: {
      fields: {
        conversationMessages: {
          keyArgs: ["conversationId", "leftAtMessageId"],
          read(existing) {
            return existing;
          },
          merge(existing = { messages: [] }, incoming = {}, { mergeObjects }) {
            return {
              ...existing,
              hasNextPage: incoming.hasNextPage,
              conversation: incoming.conversation,
              messages: [...incoming.messages, ...existing.messages],
            };
          },
        },
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
            let secondThread: Array<{ [key: string]: Post }> = [];
            existing &&
              existing.feed &&
              existing.feed.forEach((item: any) => (thread[item.__ref] = item));

            existing &&
              existing.feed &&
              existing.feed.forEach((item: any) => {
                const ref = toReference(item);
                const inReplyToId: any = readField("inReplyToId", ref);
                return (secondThread[inReplyToId] = item);
              });
            let array =
              existing &&
              existing.feed &&
              existing.feed.filter((item: any) => {
                // const ref = toReference(item);
                // const field = readField("conversationId", ref);
                // return field === item.__ref;
                const ref = toReference(item);
                const field = readField("replyCount", ref);
                // const conversationId = readField("conversationId", ref);
                // || conversationId === ref!.__ref;
                return !field;
              });

            array &&
              array!.length &&
              array!.slice(0).forEach((post: any) => {
                const ref = toReference(post);
                // const conversationId: any = readField("conversationId", ref);
                // let child: any = secondThread[conversationId];

                // if (child && !array!.includes(child)) {
                //   const idx = array!.indexOf(post);
                //   array!.splice(idx + 1, 0, child);
                //   const ref = toReference(child);
                //   const replyCount = readField("replyCount", ref);
                //   if (replyCount) {
                //     let childOfaChild: any = secondThread[child.__ref];
                //     const idx = array!.indexOf(child);
                //     array!.splice(idx + 1, 0, childOfaChild);
                //   }
                // }
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
            return {
              ...incoming,
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

export const localConversation = makeVar<Conversation>({
  id: "",
  conversationId: "",
  __typename: "Conversation",
  lastReadMessageId: "",
  messages_conversation: [],
  mostRecentEntryId: "",
  oldestEntryId: "",
  participants: [],
  type: "",
  user: {} as any,
});
