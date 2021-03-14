import * as React from "react";
import { Modal } from "./ModalComposition/Modal";
import { AuthUserDocument, PostQuery } from "../../generated/graphql";
import {
  StyledDetailsContainer,
  StyledPostWrapper,
} from "../PostComposition/styles";
import {
  BaseStylesDiv,
  HoverContainer,
  Absolute,
  Connector,
  Spinner,
  SpanContainer,
} from "../../styles";
import { ReactComponent as Close } from "../svgs/Close.svg";
import { CreatePost } from "../CreatePost";
import { useLocation } from "react-router-dom";
import { PostProvider } from "../PostContext";
import { Post } from "../PostComposition/";
import { useQuery } from "@apollo/client";
import { PostDocument } from "../../generated/introspection-result";

export const CreatePostModal: React.FC = () => {
  const location: any = useLocation();

  const postId = location.state && location.state.postId;

  const { data, loading }: any = useQuery<PostQuery>(PostDocument, {
    variables: { postId: postId && postId },
  });

  const { data: userData, loading: userLoading } = useQuery(AuthUserDocument);

  return (
    <Modal>
      <Modal.Header>
        {({ closeModal }) => {
          return (
            <BaseStylesDiv>
              <HoverContainer>
                <Absolute onClick={closeModal} />
                <Close />
              </HoverContainer>
            </BaseStylesDiv>
          );
        }}
      </Modal.Header>
      {!userLoading && !loading && userData ? (
        <Modal.Content>
          <React.Fragment>
            {!loading && data! && data!.post! ? (
              <PostProvider
                post={data!.post!.node!}
                userId={userData!.authUser!.id}
              >
                <Post>
                  <Post.ShowThread />
                  <StyledPostWrapper disableHover>
                    <Post.Threaded />
                    <BaseStylesDiv>
                      <Post.Avatar>
                        <Connector />
                      </Post.Avatar>
                      <StyledDetailsContainer>
                        <Post.Header displayDate></Post.Header>
                        <Post.Body />
                        <div style={{ padding: "5px 0 15px 0" }}>
                          <SpanContainer grey>
                            <span>
                              Replying to @{data!.post!.node!.owner.username}
                            </span>
                          </SpanContainer>
                        </div>
                      </StyledDetailsContainer>
                    </BaseStylesDiv>
                  </StyledPostWrapper>
                </Post>
              </PostProvider>
            ) : null}
            <CreatePost
              user={userData!.authUser!}
              postToReplyTo={{
                conversationId: data && data!.post!.node!.conversationId!,
                postId: data && data!.post!.node!.id!,
              }}
            />
          </React.Fragment>
        </Modal.Content>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};
