import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    feed(offset: Int): FeedSuccess! @auth
    conversation(conversationId: ID!, postId: ID!): [Post!]
    post(postId: ID!): PostByIdResult!
    replies(postId: ID!, offset: Int, loadMoreId: ID): [Post!]
    userPosts(userId: ID!, offset: Int): [Post!]
    likedPosts(userId: ID!, offset: Int): [Post!]
    postsAndReplies(userId: ID!, offset: Int): [Post!]
  }
  extend type Mutation {
    createPost(body: String!, conversationId: ID, inReplyToId: ID): Post @auth
    deletePost(id: ID!): DeleteResourceResponse @auth(requires: [ownsPost])
    likePost(id: ID!): UpdateResourceResponse @auth
    loadMorePosts(postId: ID!): [Post!]
  }
  type Post implements Node {
    id: ID!
    body: String!
    owner: User
    conversation: [Post!]
    conversationId: String
    inReplyToId: String
    likes: [User!]
    likesCount: Int
    replyCount: Int
  }
  union PostByIdResult = PostByIdSuccess | PostByIdInvalidInputError
  type PostByIdSuccess {
    node: Post!
  }
  type PostByIdInvalidInputError implements Error {
    message: String!
    id: ID!
  }
  type FeedSuccess {
    feed: [Post!]
    length: Int
  }
`;
