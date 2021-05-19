import * as React from "react";
import { Connector, JustifyCenter, Spinner } from "../../../styles";
import { DetailsInfo } from "./styles";
import { BaseStylesDiv, SpanContainer } from "../../../styles";
import {
  ConversationQuery,
  ConversationSuccess,
  Tweet as TweetType,
  User,
} from "../../../generated/graphql";
import { Comments } from "./Comments";
import { TweetProvider } from "../../../components/TweetContext";
import {
  StyledDetailsContainer,
  StyledTweetWrapper,
} from "../../../components/TweetComposition/styles";
import { Tweet } from "../../../components/TweetComposition";
import { Header } from "../../../components/TweetComposition/Header";
import { DropdownProvider } from "../../../components/DropDown/context";
import { dynamicReducer } from "../../../components/DropDown/reducers";
import { useQuery } from "@apollo/client";
import { ConversationDocument } from "../../../generated/introspection-result";

interface Props {
  tweet: TweetType;
  user: User;
}

export const Conversation: React.FC<Props> = ({ tweet, user }) => {
  const { data, loading } = useQuery<ConversationQuery>(ConversationDocument, {
    variables: {
      conversationId: tweet.conversationId,
      tweetId: tweet!.id,
    },
  });

  if (loading) return <Spinner />;

  return (
    <React.Fragment>
      {data?.conversation.__typename === "ConversationInvalidInputError" ? (
        <BaseStylesDiv flexGrow>
          <JustifyCenter>
            <SpanContainer bigger bolder>
              <span>{data.conversation.message}</span>
            </SpanContainer>
          </JustifyCenter>
        </BaseStylesDiv>
      ) : null}
      {data?.conversation.__typename === "ConversationSuccess"
        ? data?.conversation.edges?.map((tweet, index) => (
            <TweetProvider
              key={tweet.id}
              tweet={tweet}
              prevTweet={
                (data!.conversation! as ConversationSuccess)!.edges![index - 1]
              }
              userId={user!.id!}
            >
              <Tweet>
                <StyledTweetWrapper>
                  <Tweet.Thread>
                    <Connector isReply />
                  </Tweet.Thread>
                  <BaseStylesDiv>
                    <Tweet.Avatar>
                      {tweet!.replyCount! ? <Connector /> : null}
                    </Tweet.Avatar>
                    <StyledDetailsContainer>
                      <Tweet.Header>
                        <DropdownProvider reducer={dynamicReducer}>
                          <Header.Menu />
                        </DropdownProvider>
                      </Tweet.Header>
                      <Tweet.Body />
                      <Tweet.Footer />
                    </StyledDetailsContainer>
                  </BaseStylesDiv>
                </StyledTweetWrapper>
              </Tweet>
            </TweetProvider>
          ))
        : null}
      <>
        {tweet.inReplyToId &&
        data?.conversation.__typename === "ConversationSuccess" &&
        !data!.conversation!.edges?.some(
          (el) => el.id === tweet.inReplyToId
        ) ? (
          <SpanContainer>
            <span>post not available</span>
          </SpanContainer>
        ) : null}
        {data && data?.conversation.__typename === "ConversationSuccess" ? (
          <TweetProvider
            tweet={tweet}
            userId={user!.id!}
            prevTweet={
              data!.conversation!.edges![data!.conversation!.edges!.length - 1]
            }
          >
            <Tweet>
              <StyledTweetWrapper disableHover>
                <Tweet.Thread />
                <BaseStylesDiv>
                  <Tweet.Avatar showThreadLine={false} />
                  <StyledDetailsContainer>
                    <Tweet.Header displayDate={false} flexColumn>
                      <DropdownProvider reducer={dynamicReducer}>
                        <Header.Menu />
                      </DropdownProvider>
                    </Tweet.Header>
                  </StyledDetailsContainer>
                </BaseStylesDiv>
                <Tweet.ReplyingTo />
                <Tweet.Body biggest />
                <DetailsInfo>
                  <SpanContainer bold marginRight>
                    {tweet!.likesCount!}
                  </SpanContainer>
                  <SpanContainer grey>Likes</SpanContainer>
                </DetailsInfo>
                <BaseStylesDiv
                  style={{
                    marginRight: "20px",
                  }}
                >
                  <Tweet.Footer marginAuto />
                </BaseStylesDiv>
              </StyledTweetWrapper>
            </Tweet>
          </TweetProvider>
        ) : null}
      </>
      <Comments tweet={tweet} userId={user!.id!} />
    </React.Fragment>
  );
};
