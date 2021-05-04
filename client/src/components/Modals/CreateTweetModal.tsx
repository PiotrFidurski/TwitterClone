import * as React from "react";
import { Modal } from "./ModalComposition/Modal";
import {
  AuthUserDocument,
  TweetQuery,
  TweetDocument,
} from "../../generated/graphql";
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
import { CreateTweet } from "../CreateTweet";
import { useLocation } from "react-router-dom";
import { TweetProvider } from "../TweetContext";
import { Tweet } from "../PostComposition";
import { useQuery } from "@apollo/client";

export const CreateTweetModal: React.FC = () => {
  const location: any = useLocation();

  const tweetId = location.state?.tweetId;
  console.log(location);
  const { data, loading } = useQuery<TweetQuery>(TweetDocument, {
    variables: { tweetId },
  });
  console.log(data);
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
            {data?.tweet?.__typename === "TweetSuccess" ? (
              <TweetProvider
                tweet={data.tweet.node}
                userId={userData!.authUser!.id}
              >
                <Tweet>
                  <Tweet.ShowThread />
                  <StyledPostWrapper disableHover>
                    <Tweet.Threaded />
                    <BaseStylesDiv>
                      <Tweet.Avatar>
                        <Connector />
                      </Tweet.Avatar>
                      <StyledDetailsContainer>
                        <Tweet.Header displayDate></Tweet.Header>
                        <Tweet.Body />
                        <div style={{ padding: "5px 0 15px 0" }}>
                          <SpanContainer grey>
                            <span>
                              Replying to @{data!.tweet.node!.owner?.username}
                            </span>
                          </SpanContainer>
                        </div>
                      </StyledDetailsContainer>
                    </BaseStylesDiv>
                  </StyledPostWrapper>
                </Tweet>
              </TweetProvider>
            ) : null}
            {data?.tweet.__typename === "TweetSuccess" ? (
              <CreateTweet
                user={userData!.authUser!}
                tweetToReplyTo={{
                  conversationId: data.tweet.node.conversationId!,
                  tweetId: data.tweet.node.id,
                }}
              />
            ) : (
              <CreateTweet user={userData!.authUser!} />
            )}
          </React.Fragment>
        </Modal.Content>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};
