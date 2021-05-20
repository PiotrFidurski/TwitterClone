import { ApolloQueryResult } from "@apollo/client";
import { FeedQuery, RepliesQuery, Tweet } from "../../generated/graphql";

interface Props {
  data: Tweet[];
  loadMore: () => Promise<ApolloQueryResult<FeedQuery | RepliesQuery>>;
  userId: string;
  loading?: boolean;
  hasNextPage?: boolean;
  showThreadLine?: boolean;
  showTweetBorder?: boolean;
}

interface ItemData {
  array: Tweet[];
  setRowHeight: (index: any, size: any) => void;
  userId: string;
  showThreadLine: boolean;
  showTweetBorder: boolean;
}

export type { Props, ItemData };
