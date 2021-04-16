import { useMutation } from "@apollo/client";
import {
  Conversation,
  UpdateLastSeenMessageDocument,
  UpdateLastSeenMessageMutation,
} from "../generated/graphql";

export const useReadAllUnseenMessages = (
  conversations: Array<Conversation>
) => {
  const [markAsSeen] = useMutation<UpdateLastSeenMessageMutation>(
    UpdateLastSeenMessageDocument
  );
  let arr: Array<number> = [];
  let dates: Array<{ [key: string]: Conversation }> = [];
  conversations!.forEach((conversation) => {
    if (conversation.mostRecentEntryId) {
      const date = new Date(
        parseInt(conversation!.mostRecentEntryId!.substring(0, 8), 16) * 1000
      );
      const key = Math.abs(new Date().getTime() - date.getTime()).toString();
      dates[key] = conversation;
      arr = [...arr, Math.abs(new Date().getTime() - date.getTime())];
    }
  });

  const handleUnreadMessages = async () => {
    return await markAsSeen({
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
                lastSeenMessageId: data!.updateLastSeenMessage!
                  .lastSeenMessageId!,
              };
            },
          },
        });
      },
    });
  };

  return handleUnreadMessages;
};
