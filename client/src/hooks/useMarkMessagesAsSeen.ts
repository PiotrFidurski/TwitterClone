import { useMutation } from "@apollo/client";
import {
  Conversation,
  LastSeenMessage,
  SeeMessageDocument,
  SeeMessageMutation,
  UpdateResourceResponse,
} from "../generated/graphql";

export const useMarkMessagesAsSeen = (conversations: Array<Conversation>) => {
  const [markAsSeen] = useMutation<SeeMessageMutation>(SeeMessageDocument);
  let arr: Array<number> = [];
  let dates: Array<{ [key: string]: Conversation }> = [];
  conversations?.forEach((conversation) => {
    if (conversation.mostRecentEntryId) {
      const date = new Date(
        parseInt(conversation?.mostRecentEntryId?.substring(0, 8), 16) * 1000
      );
      const key = Math.abs(new Date().getTime() - date.getTime()).toString();
      dates[key] = conversation;
      arr = [...arr, Math.abs(new Date().getTime() - date.getTime())];
    }
  });

  const handleUnreadMessages = async () => {
    if (conversations.length) {
      await markAsSeen({
        variables: {
          messageId:
            dates.length && dates[Math.min(...arr)]
              ? dates[Math.min(...arr)].mostRecentEntryId
              : "",
        },
        update(cache, { data }) {
          cache.modify({
            fields: {
              userInbox(cachedEntries) {
                return {
                  ...cachedEntries,
                  lastSeenMessageId: ((data!
                    .seeMessage! as UpdateResourceResponse)
                    .node as LastSeenMessage).lastSeenMessageId,
                };
              },
            },
          });
        },
      });
    }
  };

  return handleUnreadMessages;
};
