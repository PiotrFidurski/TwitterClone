import * as React from "react";
import { CreateTweet } from "../CreateTweet";
import { User, FeedQuery } from "../../generated/graphql";
import {
  Spinner,
  PlaceHolder,
  BaseStyles,
  PrimaryColumn,
  SidebarColumn,
} from "../../styles";
import styled from "styled-components";
import { Header as FeedHeader } from "../Header";
import { useQuery } from "@apollo/client";
import { FeedDocument } from "../../generated/introspection-result";
import { VirtualizedList } from "../VirtualizedList";
import "../../index.css";
import { SecondaryColumn } from "../SecondaryColumn";

export const StyledContainer = styled.div`
  ${BaseStyles};
  flex-direction: row;
  justify-content: space-between;
  flex-grow: 1;
  animation-duration: 0.15s;
  height: 100%;
  opacity: 1;
  position: relative;
  z-index: 1;
`;

interface Props {
  user: User;
  postId?: string;
}

interface GnenerateFeedProps {
  userId: string;
}

const GenerateFeed: React.FC<GnenerateFeedProps> = ({ userId }) => {
  const { data, loading, fetchMore } = useQuery<FeedQuery>(FeedDocument);

  const loadMore = React.useCallback(async (): Promise<any> => {
    try {
      await fetchMore({
        variables: {
          after: data?.feed.pageInfo.endCursor,
        },
      });
    } catch (error) {}
  }, [fetchMore, data]);

  if (loading) return <Spinner />;

  return !loading && data ? (
    <div id="feed">
      <VirtualizedList
        userId={userId}
        loading={loading}
        data={data?.feed.edges!}
        hasNextPage={data?.feed.pageInfo.hasNextPage}
        loadMore={loadMore}
      />
    </div>
  ) : null;
};

export const Feed: React.FC<Props> = ({ user }) => (
  <StyledContainer>
    <PrimaryColumn>
      <FeedHeader justifyStart={false}>Home</FeedHeader>
      <CreateTweet user={user} />
      <PlaceHolder light />
      <GenerateFeed userId={user!.id} />
    </PrimaryColumn>
    <SidebarColumn>
      <SecondaryColumn user={user} />
    </SidebarColumn>
  </StyledContainer>
);
