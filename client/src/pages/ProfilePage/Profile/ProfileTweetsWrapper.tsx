import { useQuery } from "@apollo/client";
import { DocumentNode } from "apollo-link";
import * as React from "react";
import { useParams } from "react-router";
import { VirtualizedList } from "../../../components/VirtualizedList";
import {
  GetUserByNameQuery,
  GetUserByNameDocument,
  UserTweetsQuery,
  UserTweetsAndRepliesQuery,
  UserLikedTweetsQuery,
} from "../../../generated/graphql";
import {
  Spinner,
  BaseStylesDiv,
  JustifyCenter,
  SpanContainer,
} from "../../../styles";

interface Props {
  type: "userTweets" | "userTweetsAndReplies" | "userLikedTweets";
  document: DocumentNode;
}

export const ProfileTweetsWrapper: React.FC<Props> = ({
  type = "userTweets",
  document,
}) => {
  const { username } = useParams<{ username: string }>();

  const { data: userData, loading: userLoading } = useQuery<GetUserByNameQuery>(
    GetUserByNameDocument,
    {
      variables: { username },
    }
  );

  const userId =
    userData?.userByName.__typename === "UserByNameSuccess"
      ? userData.userByName.node.id
      : "";

  const { data, loading, fetchMore } = useQuery<
    UserTweetsQuery | UserTweetsAndRepliesQuery | UserLikedTweetsQuery
  >(document, {
    variables: {
      userId,
    },
  });

  const loadMore = async (): Promise<any> => {
    try {
      const after =
        data?.[type].__typename === "TweetConnection" &&
        data?.[type].pageInfo.endCursor;
      await fetchMore({
        variables: {
          userId,
          after,
        },
      });
    } catch (error) {
      return error;
    }
  };

  if (loading || userLoading) return <Spinner />;

  return userData?.userByName?.__typename === "UserByNameSuccess" &&
    data?.[type].__typename === "TweetConnection" ? (
    <div id="feed">
      <VirtualizedList
        showTweetBorder={true}
        showThreadLine={false}
        data={data?.[type]?.edges!}
        userId={userData!.userByName!.node.id!}
        loadMore={loadMore}
        hasNextPage={data?.[type]?.pageInfo!.hasNextPage}
      />
    </div>
  ) : data?.[type].__typename === "TweetsInvalidInputError" ? (
    <BaseStylesDiv flexGrow>
      <JustifyCenter>
        <SpanContainer bigger bolder>
          <span>{data?.[type].message}</span>
        </SpanContainer>
      </JustifyCenter>
    </BaseStylesDiv>
  ) : null;
};
