import { useMutation } from "@apollo/client";
import {
  Conversation,
  SeeMessageDocument,
  SeeMessageMutation,
} from "../generated/graphql";
import { convertIdToDate } from "../utils/functions";

export const useMarkMessagesAsSeen = (conversations: Array<Conversation>) => {
  const [markAsSeen] = useMutation<SeeMessageMutation>(SeeMessageDocument);

  const [{ mostRecentEntryId = "" }] = conversations?.filter((conversation) => {
    if (conversation.mostRecentEntryId) {
      const date = convertIdToDate(conversation?.mostRecentEntryId!);
      const mostRecentDate = new Date(
        Math.max(
          ...[convertIdToDate(conversation?.mostRecentEntryId!).getTime()]
        )
      );
      if (date.getTime() === mostRecentDate.getTime()) {
        return conversation;
      }
    }
    return { mostRecentEntryId: "" };
  });

  const updateSeenMessages = async () => {
    if (conversations.length && mostRecentEntryId) {
      await markAsSeen({
        variables: {
          messageId: mostRecentEntryId,
        },
        update(cache) {
          cache.modify({
            fields: {
              userInbox(cachedEntries) {
                return {
                  ...cachedEntries,
                  lastSeenMessageId: mostRecentEntryId,
                };
              },
            },
          });
        },
      });
    }
  };

  return updateSeenMessages;
};
