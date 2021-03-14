import * as React from "react";
import { Connector, Spinner } from "../../../styles";
import { DetailsInfo } from "./styles";
import { BaseStylesDiv, SpanContainer } from "../../../styles";
import {
  ConversationQuery,
  Post as PostType,
  User,
} from "../../../generated/graphql";
import { Comments } from "./Comments";
import { PostProvider } from "../../../components/PostContext";
import {
  StyledDetailsContainer,
  StyledPostWrapper,
} from "../../../components/PostComposition/styles";
import { Header, Post } from "../../../components/PostComposition";
import { DisplayMoreButton } from "../../../components/PostComposition/DisplayMoreButton";
import { DropdownProvider } from "../../../components/DropDown";
import { moveUpAndLeftReducer } from "../../../components/DropDown/reducers";
import { useQuery } from "@apollo/client";
import { ConversationDocument } from "../../../generated/introspection-result";

interface Props {
  post: PostType;
  user: User;
}

export const Conversation: React.FC<Props> = ({ post, user }) => {
  const { data, loading } = useQuery<ConversationQuery>(ConversationDocument, {
    variables: {
      conversationId: post!.conversationId!,
      postId: post!.id,
    },
  });

  if (loading) return <Spinner />;

  return (
    <React.Fragment>
      {!loading &&
        data &&
        data.conversation!.map((post, index) => (
          <PostProvider
            key={post.id}
            post={post}
            prevItem={data!.conversation![index - 1]}
            userId={user!.id!}
          >
            <Post>
              <StyledPostWrapper>
                <Post.Threaded>
                  <Connector isReply />
                </Post.Threaded>
                <BaseStylesDiv>
                  <Post.Avatar>
                    {post!.replyCount! ? <Connector /> : null}
                  </Post.Avatar>
                  <StyledDetailsContainer>
                    <Post.Header>
                      <DropdownProvider
                        position="absolute"
                        reducer={moveUpAndLeftReducer}
                      >
                        <Header.Menu />
                      </DropdownProvider>
                    </Post.Header>
                    <Post.Body />
                    <Post.Footer />
                  </StyledDetailsContainer>
                </BaseStylesDiv>
              </StyledPostWrapper>
            </Post>
          </PostProvider>
        ))}
      <>
        {post.inReplyToId &&
        !data!.conversation!.some((el) => el.id === post.inReplyToId) ? (
          <DisplayMoreButton post={post} isPostView>
            post not available
          </DisplayMoreButton>
        ) : null}
        <PostProvider
          post={post}
          userId={user!.id!}
          prevItem={data!.conversation![data!.conversation!.length - 1]}
        >
          <Post showBorder={true}>
            <StyledPostWrapper disableHover>
              <Post.Threaded />
              <BaseStylesDiv>
                <Post.Avatar />
                <StyledDetailsContainer>
                  <Post.Header displayDate={false} flexColumn>
                    <DropdownProvider
                      position="absolute"
                      reducer={moveUpAndLeftReducer}
                    >
                      <Header.Menu />
                    </DropdownProvider>
                  </Post.Header>
                </StyledDetailsContainer>
              </BaseStylesDiv>
              <Post.ReplyingTo />
              <Post.Body biggest />
              <DetailsInfo>
                <SpanContainer bold marginRight>
                  {post!.likesCount!}
                </SpanContainer>
                <SpanContainer grey>Likes</SpanContainer>
              </DetailsInfo>
              <BaseStylesDiv
                style={{
                  marginRight: "20px",
                }}
              >
                <Post.Footer marginAuto />
              </BaseStylesDiv>
            </StyledPostWrapper>
          </Post>
        </PostProvider>
      </>
      <Comments post={post} userId={user!.id!} />
    </React.Fragment>
  );
};
