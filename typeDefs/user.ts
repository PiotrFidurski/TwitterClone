import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    authUser: User! @auth
    userByName(username: String!): UserByNameResult!
    randomUsers(userId: String!): [User!]
  }
  extend type Mutation {
    login(email: String!, password: String!): UserLoginResult
    register(
      name: String!
      username: String!
      email: String!
      password: String!
    ): UserRegisterResult!
    logout: Boolean
    updateUser(
      userId: ID!
      name: String
      bio: String
      website: String
    ): UserUpdateResult @auth(requires: [ownsAccount])
    uploadAvatar(file: Upload!, userId: ID!): UpdateResourceResponse
      @auth(requires: [ownsAccount])
    followUser(userId: ID!): FollowUserResult @auth
  }
  type User implements Node {
    id: ID!
    username: String
    name: String
    email: String
    password: String @auth
    bio: String
    website: String
    avatar: String
    lastReadMessageId: String
    lastSeenMessageId: String
    following: [User!]
    followers: [User!]
    followersCount: Int
    followingCount: Int
  }
  union UserByNameResult = UserByNameSuccess | UserByNameInvalidInputError
  type UserByNameSuccess {
    node: User!
  }
  type UserByNameInvalidInputError implements Error {
    message: String!
    username: String
  }
  union UserRegisterResult = UserRegisterSuccess | UserRegisterInvalidInputError
  type UserRegisterSuccess {
    node: User!
  }
  type UserRegisterInvalidInputError implements Error {
    message: String!
    name: String
    username: String
    email: String
    password: String
  }
  union UserLoginResult = UserLoginSuccess | UserLoginInvalidInputError
  type UserLoginSuccess {
    accessToken: String!
    node: User!
  }
  type UserLoginInvalidInputError implements Error {
    message: String!
    email: String
    password: String
  }
  union UserUpdateResult = UserUpdateSuccess | UserUpdateInvalidInputError
  type UserUpdateSuccess {
    node: User!
  }
  type UserUpdateInvalidInputError implements Error {
    message: String!
    name: String
    bio: String
    website: String
    userId: String
  }
  union FollowUserResult = UpdateResourceResponse | FollowUserInvalidInputError
  type FollowUserInvalidInputError implements Error {
    message: String!
    userId: String
  }
`;
