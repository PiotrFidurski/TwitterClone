import * as React from "react";
import { RepliesDocument, RepliesQuery } from "../../../generated/graphql";
import {
  BaseStylesDiv,
  JustifyCenter,
  PlaceHolder,
  SpanContainer,
  Spinner,
} from "../../../styles";
import { useQuery } from "@apollo/client";
import { Tweet as TweetType } from "../../../generated/introspection-result";
import { VirtualizedList } from "../../../components/VirtualizedList";

interface Props {
  tweet: TweetType;
  userId?: string;
}

export const Comments: React.FC<Props> = ({ tweet, userId }) => {
  const { data, loading, fetchMore } = useQuery<RepliesQuery>(RepliesDocument, {
    variables: { tweetId: tweet.id },
  });

  const loadMore = async (): Promise<any> => {
    try {
      const after =
        data?.replies.__typename === "TweetConnection" &&
        data.replies.pageInfo.endCursor;

      await fetchMore({
        variables: {
          tweetId: tweet!.id,
          after,
        },
      });
    } catch (error) {}
  };

  if (loading) return <Spinner />;

  return data?.replies.__typename === "TweetConnection" ? (
    <div>
      <PlaceHolder light />
      <VirtualizedList
        userId={userId!}
        loading={loading}
        loadMore={loadMore}
        hasNextPage={data!.replies!.pageInfo.hasNextPage!}
        data={data.replies!.edges!}
      />
    </div>
  ) : data?.replies.__typename === "TweetsInvalidInputError" ? (
    <BaseStylesDiv flexGrow>
      <JustifyCenter>
        <SpanContainer bigger bolder>
          <span>{data.replies.message}</span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : null;
};
