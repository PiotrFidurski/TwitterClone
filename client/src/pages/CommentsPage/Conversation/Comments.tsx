import * as React from "react";
import { RepliesDocument, RepliesQuery } from "../../../generated/graphql";
import { PlaceHolder, Spinner } from "../../../styles";
import { useQuery } from "@apollo/client";
import { Post as PostType } from "../../../generated/introspection-result";
import { VirtualizedList } from "../../../components/VirtualizedList";

interface Props {
  post: PostType;
  userId?: string;
}

export const Comments: React.FC<Props> = ({ post, userId }) => {
  const { data, loading, fetchMore } = useQuery<RepliesQuery>(RepliesDocument, {
    variables: { postId: post!.id! },
  });

  const loadMore = React.useCallback(async (): Promise<any> => {
    const length =
      data &&
      data!.replies!.filter((_post) => _post!.inReplyToId === post.id).length;
    try {
      await fetchMore({
        variables: { postId: post!.id, offset: length },
      });
    } catch (error) {}
  }, [data, fetchMore, post]);

  if (loading) return <Spinner />;

  return !loading && data ? (
    <>
      <PlaceHolder light />
      <VirtualizedList
        userId={userId!}
        loadMore={loadMore}
        data={data!.replies!}
        itemCount={data!.replies!.length}
        showConnector={true}
      />
    </>
  ) : null;
};
