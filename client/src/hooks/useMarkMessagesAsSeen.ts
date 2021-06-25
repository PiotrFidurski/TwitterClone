import { useMutation } from "@apollo/client";
import {
  Conversation,
  LastSeenMessage,
  SeeMessageDocument,
  SeeMessageMutation,
  UpdateResourceResponse,
} from "../generated/graphql";
import { getClosestToDate } from "../utils/functions";

export const useMarkMessagesAsSeen = (conversations: Array<Conversation>) => {
  const [markAsSeen] = useMutation<SeeMessageMutation>(SeeMessageDocument);

  const mostRecentEntryId = getClosestToDate(Date.now(), conversations);

  const updateSeenMessages = async () => {
    if (conversations.length) {
      await markAsSeen({
        variables: {
          messageId: mostRecentEntryId,
        },
        update(cache, { data }) {
          if (data?.seeMessage.__typename === "UpdateResourceResponse") {
            const lastSeenMsgId = (
              (data?.seeMessage as UpdateResourceResponse)
                .node as LastSeenMessage
            ).lastSeenMessageId;
            cache.modify({
              fields: {
                userInbox(cachedEntries) {
                  return {
                    ...cachedEntries,
                    lastSeenMessageId: lastSeenMsgId,
                  };
                },
              },
            });
          }
        },
      });
    }
  };

  return updateSeenMessages;
};
