import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    feed(after: String): TweetConnection! @auth
    conversation(conversationId: ID!, tweetId: ID!): ConversationResult!
    tweet(tweetId: ID): TweetResult!
    replies(tweetId: ID!, after: ID): TweetsResult!
    userTweets(userId: ID!, after: ID): TweetsResult!
    userLikedTweets(userId: ID!, after: ID): TweetsResult!
    userTweetsAndReplies(userId: ID!, after: ID): TweetsResult!
  }
  extend type Mutation {
    repliesToTweet(tweetId: ID!): RepliesToTweetResult!
    createTweet(
      body: String!
      conversationId: ID
      inReplyToId: ID
    ): CreateTweetResult @auth
    deleteTweet(tweetId: ID!): DeleteTweetResult @auth(requires: [ownsPost])
    likeTweet(tweetId: ID!): LikeTweetResult @auth
  }
  type Tweet implements Node {
    id: ID!
    body: String!
    owner: User
    conversation: [Tweet!]
    conversationId: String
    inReplyToId: String
    likes: [User!]
    likesCount: Int
    replyCount: Int
  }
  type TweetConnection {
    count: Int!
    pageInfo: PageInfo!
    edges: [Tweet!]
  }
  type TweetEdge {
    cursor: String!
    node: Tweet!
  }
  union TweetResult = TweetSuccess | TweetInvalidInputError
  type TweetSuccess {
    node: Tweet!
  }
  type TweetInvalidInputError implements Error {
    message: String!
    tweetId: String
  }
  union ConversationResult = ConversationSuccess | ConversationInvalidInputError
  type ConversationSuccess {
    edges: [Tweet!]
  }
  type ConversationInvalidInputError implements Error {
    message: String!
    tweetId: String
    conversationId: String
  }
  union RepliesToTweetResult =
      RepliesToTweetSuccess
    | RepliesToTweetInvalidInputError
  type RepliesToTweetSuccess {
    edges: [Tweet!]
  }
  type RepliesToTweetInvalidInputError implements Error {
    message: String!
    tweetId: String
  }
  union TweetsResult = TweetConnection | TweetsInvalidInputError
  type TweetsInvalidInputError implements Error {
    message: String!
    after: String
    userId: String
    tweetId: String
  }
  union CreateTweetResult = Tweet | CreateTweetInvalidInputError
  type CreateTweetInvalidInputError implements Error {
    message: String!
    body: String
    conversationId: String
    inReplyToId: String
  }
  union DeleteTweetResult =
      DeleteResourceResponse
    | DeleteTweetInvalidInputError
  type DeleteTweetInvalidInputError implements Error {
    message: String!
    tweetId: String
  }
  union LikeTweetResult = UpdateResourceResponse | LikeTweetInvalidInputError
  type LikeTweetInvalidInputError implements Error {
    message: String!
    tweetId: String
  }
`;
