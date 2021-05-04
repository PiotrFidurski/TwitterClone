import { ApolloCache } from "@apollo/client";
import {
  ConversationUpdatedDocument,
  ConversationUpdatedSubscription,
  User,
} from "../../generated/graphql";

interface UserInbox {
  __typename: string;
  conversations: { __ref: string }[];
  users: { __ref: string }[];
}

interface messages {
  __typename: string;
  edges: { __ref: string }[];
  conversation: { __ref: string };
}

export const inboxSubscription = (cache: ApolloCache<object>, user: User) => ({
  document: ConversationUpdatedDocument,
  variables: { userId: user!.id! },
  updateQuery: (
    prev: any,
    {
      subscriptionData,
    }: { subscriptionData: { data: ConversationUpdatedSubscription } }
  ) => {
    if (!subscriptionData.data) return prev;

    cache.modify({
      fields: {
        userInbox(cachedEntries: UserInbox, { toReference, readField }) {
          const newConversationRef = toReference(
            subscriptionData!.data!.conversationUpdated!.conversation!.id
          );
          const newUserRef = toReference(
            subscriptionData!.data!.conversationUpdated!.sender!.id
          );
          if (
            cachedEntries!.conversations.some(
              (conversation) => conversation.__ref === newConversationRef!.__ref
            )
          ) {
            return {
              ...cachedEntries,
              conversations: cachedEntries!.conversations!.filter(
                (conversation) => {
                  if (conversation!.__ref === newConversationRef!.__ref) {
                    const ref = toReference(conversation);
                    const newMessageRef = toReference(
                      subscriptionData!.data!.conversationUpdated!.message!.id
                    );
                    const messages_conversation = readField(
                      "messages_conversation",
                      ref
                    ) as { __ref: string }[];
                    return {
                      ...conversation,
                      messages_conversation: [...messages_conversation!].splice(
                        0,
                        0,
                        newMessageRef!
                      ),
                    };
                  }
                  return conversation;
                }
              ),
            };
          }
          return (
            cachedEntries && {
              ...cachedEntries,
              conversations: [
                ...cachedEntries!.conversations,
                newConversationRef!,
              ],
              users: [...cachedEntries!.users, newUserRef],
            }
          );
        },
        messages(cachedEntries: messages, { toReference }) {
          const newMessage = toReference(
            subscriptionData!.data!.conversationUpdated!.message!
          );

          if (
            cachedEntries.conversation.__ref ===
            subscriptionData!.data!.conversationUpdated!.conversation!.id
          ) {
            return {
              ...cachedEntries,
              edges: [
                ...cachedEntries.edges,
                { cursor: newMessage!.__ref, node: newMessage },
              ],
            };
          }
        },
      },
    });
  },
});
