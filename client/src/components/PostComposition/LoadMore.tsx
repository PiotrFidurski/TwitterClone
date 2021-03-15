import * as React from "react";
import { Wrapper } from "./styles";
import { RepliesDocument } from "../../generated/graphql";
import { DisplayMoreButton } from "./DisplayMoreButton";
import { Post } from "../../generated/introspection-result";
import { Spinner } from "../../styles";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

interface Props {
  post: Post;
}

export const LoadMore: React.FC<Props> = ({ post }) => {
  const [{ loaded, loading }, setLoadings] = React.useState({
    loaded: false,
    loading: false,
  });
  const { postId } = useParams<{ postId: string }>();
  const { fetchMore } = useQuery(RepliesDocument, {
    variables: { postId: postId! },
    fetchPolicy: "network-only",
    skip: true,
  });

  return (
    <Wrapper
      style={loaded ? { borderBottom: "transparent" } : {}}
      onClick={async (e) => {
        e.stopPropagation();

        try {
          setLoadings({ loaded: false, loading: true });
          await fetchMore!({
            variables: { postId: postId!, loadMoreId: post.id! },
          });
          setLoadings({ loaded: true, loading: false });
        } catch (e) {}
      }}
    >
      {!loading && !loaded ? (
        <DisplayMoreButton post={post} isPostView={true}>
          more replies
        </DisplayMoreButton>
      ) : loading ? (
        <Spinner style={{ margin: "0 auto" }} />
      ) : null}
    </Wrapper>
  );
};
