import {
  User,
  UserFollowerFieldsFragment,
  UserAvatarFieldsFragment,
  UserByNameInvalidInputError,
  UserLoginSuccess,
  UserLoginInvalidInputError,
  UserRegisterInvalidInputError,
  Post,
  Maybe,
  PostLikesFieldsFragment,
  PostConversationFieldsFragment,
  PostByIdInvalidInputError,
} from "./graphql";
import { gql } from "@apollo/client";
import * as ApolloReactCommon from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client";

// temporary fix for union types @graphql/codegen issue
export type UserByNameQuery = { __typename?: "Query" } & {
  userByName: ({ __typename?: "UserByNameSuccess" } & {
    node: { __typename?: "User" } & Pick<
      User,
      "id" | "email" | "username" | "name" | "bio" | "website"
    > &
      UserFollowerFieldsFragment &
      UserAvatarFieldsFragment;
  }) &
    ({ __typename?: "UserByNameInvalidInputError" } & Pick<
      UserByNameInvalidInputError,
      "message" | "username"
    >);
};

export type LoginMutation = { __typename?: "Mutation" } & {
  login?: ({ __typename?: "UserLoginSuccess" } & Pick<
    UserLoginSuccess,
    "accessToken"
  > & {
      node: { __typename?: "User" } & Pick<
        User,
        "id" | "username" | "email" | "name"
      > &
        UserAvatarFieldsFragment &
        UserFollowerFieldsFragment;
    }) &
    ({ __typename?: "UserLoginInvalidInputError" } & Pick<
      UserLoginInvalidInputError,
      "email" | "password" | "message"
    >);
};

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: ({ __typename?: "UserRegisterSuccess" } & {
    node: { __typename?: "User" } & Pick<User, "id">;
  }) &
    ({ __typename?: "UserRegisterInvalidInputError" } & Pick<
      UserRegisterInvalidInputError,
      "email" | "username" | "name" | "password" | "message"
    >);
};

export type PostQuery = { __typename?: "Query" } & {
  post: ({ __typename?: "PostByIdSuccess" } & {
    node: { __typename?: "Post" } & Pick<
      Post,
      "id" | "body" | "conversationId" | "inReplyToId"
    > & {
        owner?: Maybe<
          { __typename?: "User" } & Pick<
            User,
            "id" | "username" | "name" | "email"
          > &
            UserAvatarFieldsFragment &
            UserFollowerFieldsFragment
        >;
      } & PostLikesFieldsFragment &
      PostConversationFieldsFragment;
  }) &
    ({ __typename?: "PostByIdInvalidInputError" } & Pick<
      PostByIdInvalidInputError,
      "message" | "id"
    >);
};
