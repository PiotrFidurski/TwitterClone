import { useLocation } from "react-router-dom";
import { Conversation } from "../../generated/graphql";
import { convertIdToDate } from "../../utils/functions";

export const useConversationNotifications = (
  lastSeenMessageId: string,
  conversations: Conversation[]
) => {
  const location = useLocation();
  const lastSeenDate = convertIdToDate(lastSeenMessageId);

  const count = conversations
    ?.map((conversation) => {
      if (conversation.mostRecentEntryId) {
        const mostRecentDate = convertIdToDate(
          conversation?.mostRecentEntryId!
        );

        return Number(lastSeenDate >= mostRecentDate);
      }
      return null;
    })
    .filter((value) => value === 0).length;

  return location.pathname !== "/messages" &&
    !location.pathname.match(/(\/messages\/)\d\w+.\d\w+/)
    ? [count]
    : [0];
};
