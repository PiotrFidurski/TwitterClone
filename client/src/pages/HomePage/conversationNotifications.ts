import { Conversation } from "../../generated/graphql";

export const conversationNotifications = (
  lastSeenMessageId: string,
  conversations: Conversation[]
) => {
  const lastSeenId = new Date(
    parseInt(lastSeenMessageId!.substring(0, 8), 16) * 1000
  );

  return conversations
    ?.map((conversation) => {
      if (conversation.mostRecentEntryId) {
        const recentMessageId = new Date(
          parseInt(conversation.mostRecentEntryId?.substring(0, 8), 16) * 1000
        );

        return lastSeenId >= recentMessageId;
      }
      return null;
    })
    .filter((value) => value === false);
};
