import * as React from "react";
import { CreatePost } from "../CreatePost";
import { User, FeedQuery } from "../../generated/graphql";
import { Spinner, PlaceHolder, BaseStyles } from "../../styles";
import styled from "styled-components";
import { Header as FeedHeader } from "../Header";
import { useQuery } from "@apollo/client";
import { FeedDocument } from "../../generated/introspection-result";
import { VirtualizedList } from "../VirtualizedList";
import "../../index.css";

export const StyledContainer = styled.div<{ display?: boolean }>`
  ${BaseStyles};
  flex-direction: column;
  flex-grow: 1;
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

const GenerateFeed: React.FC<GnenerateFeedProps> = React.memo(({ userId }) => {
  const { data, loading, fetchMore } = useQuery<FeedQuery>(FeedDocument);

  const loadMore = React.useCallback(async (): Promise<any> => {
    try {
      await fetchMore({
        variables: { offset: data && data!.feed!.length! },
      });
    } catch (error) {}
  }, [fetchMore, data]);

  if (loading) return <Spinner />;

  return !loading ? (
    <VirtualizedList
      userId={userId}
      loading={loading}
      data={data!.feed!.feed!}
      itemCount={data!.feed!.length!}
      loadMore={loadMore}
      showConnector={true}
    />
  ) : null;
});

export const Feed: React.FC<Props> = ({ user }) => {
  return (
    <StyledContainer id="feed">
      <FeedHeader justifyStart={false}>Home</FeedHeader>
      <CreatePost user={user} />
      <PlaceHolder light />
      <GenerateFeed userId={user!.id} />
    </StyledContainer>
  );
};
