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
  const [loaded, setLoaded] = React.useState(false);
  const { postId } = useParams<{ postId: string }>();
  const { fetchMore, loading } = useQuery(RepliesDocument, {
    variables: { postId: postId! },
    skip: true,
  });

  return !loading && !loaded ? (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation();
        setLoaded(true);
        try {
          fetchMore!({
            variables: { postId: postId!, loadMoreId: post.id! },
          });
        } catch (e) {}
      }}
    >
      <DisplayMoreButton post={post} isPostView={true}>
        more replies
      </DisplayMoreButton>
    </Wrapper>
  ) : loading ? (
    <Spinner />
  ) : null;
};
