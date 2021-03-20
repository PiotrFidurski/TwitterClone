import { gql } from "@apollo/client";
import * as ApolloReactCommon from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Node: ["User", "Post"],
    UserByNameResult: ["UserByNameSuccess", "UserByNameInvalidInputError"],
    Error: [
      "UserByNameInvalidInputError",
      "PostByIdInvalidInputError",
      "UserLoginInvalidInputError",
      "UserRegisterInvalidInputError",
      "UserUpdateInvalidInputError",
    ],
    PostByIdResult: ["PostByIdSuccess", "PostByIdInvalidInputError"],
    UserLoginResult: ["UserLoginSuccess", "UserLoginInvalidInputError"],
    UserRegisterResult: [
      "UserRegisterSuccess",
      "UserRegisterInvalidInputError",
    ],
    UserUpdateResult: ["UserUpdateSuccess", "UserUpdateInvalidInputError"],
  },
};
export default result;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: "Query";
  _?: Maybe<Scalars["String"]>;
  node?: Maybe<Node>;
  suggestedUsers?: Maybe<Array<User>>;
  authUser: User;
  userByName: UserByNameResult;
  feed: FeedSuccess;
  conversation?: Maybe<Array<Post>>;
  post: PostByIdResult;
  replies?: Maybe<Array<Post>>;
  userPosts?: Maybe<Array<Post>>;
  likedPosts?: Maybe<Array<Post>>;
  postsAndReplies?: Maybe<Array<Post>>;
  directconversation: Conversation;
  conversationMessages?: Maybe<Array<Message>>;
  userConversations?: Maybe<Array<Conversation>>;
};

export type QueryNodeArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueryUserByNameArgs = {
  username: Scalars["String"];
};

export type QueryFeedArgs = {
  offset?: Maybe<Scalars["Int"]>;
};

export type QueryConversationArgs = {
  conversationId: Scalars["ID"];
  postId: Scalars["ID"];
};

export type QueryPostArgs = {
  postId: Scalars["ID"];
};

export type QueryRepliesArgs = {
  postId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
  loadMoreId?: Maybe<Scalars["ID"]>;
};

export type QueryUserPostsArgs = {
  userId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
};

export type QueryLikedPostsArgs = {
  userId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
};

export type QueryPostsAndRepliesArgs = {
  userId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
};

export type QueryDirectconversationArgs = {
  conversationId: Scalars["ID"];
};

export type QueryConversationMessagesArgs = {
  conversationId: Scalars["ID"];
};

export type Node = {
  id: Scalars["ID"];
};

export type User = Node & {
  __typename?: "User";
  avatar?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  followers?: Maybe<Array<User>>;
  followersCount?: Maybe<Scalars["Int"]>;
  following?: Maybe<Array<User>>;
  followingCount?: Maybe<Scalars["Int"]>;
  id: Scalars["ID"];
  isFollowed?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
};

export type UserByNameResult = UserByNameSuccess | UserByNameInvalidInputError;

export type UserByNameSuccess = {
  __typename?: "UserByNameSuccess";
  node: User;
};

export type UserByNameInvalidInputError = Error & {
  __typename?: "UserByNameInvalidInputError";
  message: Scalars["String"];
  username?: Maybe<Scalars["String"]>;
};

export type Error = {
  message: Scalars["String"];
};

export type FeedSuccess = {
  __typename?: "FeedSuccess";
  feed?: Maybe<Array<Post>>;
  length?: Maybe<Scalars["Int"]>;
};

export type Post = Node & {
  __typename?: "Post";
  body: Scalars["String"];
  conversation?: Maybe<Array<Post>>;
  conversationId?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  inReplyToId?: Maybe<Scalars["String"]>;
  isLiked?: Maybe<Scalars["Boolean"]>;
  likes?: Maybe<Array<User>>;
  likesCount?: Maybe<Scalars["Int"]>;
  owner?: Maybe<User>;
  replyCount?: Maybe<Scalars["Int"]>;
};

export type PostByIdResult = PostByIdSuccess | PostByIdInvalidInputError;

export type PostByIdSuccess = {
  __typename?: "PostByIdSuccess";
  node: Post;
};

export type PostByIdInvalidInputError = Error & {
  __typename?: "PostByIdInvalidInputError";
  message: Scalars["String"];
  id: Scalars["ID"];
};

export type Conversation = {
  __typename?: "Conversation";
  id: Scalars["ID"];
  conversationId: Scalars["String"];
  members?: Maybe<Array<User>>;
  type?: Maybe<Scalars["String"]>;
};

export type Message = {
  __typename?: "Message";
  id: Scalars["ID"];
  conversationId: Scalars["String"];
  messagedata: MessageData;
};

export type MessageData = {
  __typename?: "MessageData";
  id: Scalars["ID"];
  text: Scalars["String"];
  conversationId: Scalars["String"];
  senderId: Scalars["String"];
  receiverId: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["String"]>;
  login?: Maybe<UserLoginResult>;
  register: UserRegisterResult;
  logout?: Maybe<Scalars["Boolean"]>;
  updateUser?: Maybe<UserUpdateResult>;
  uploadAvatar?: Maybe<UpdateResourceResponse>;
  followUser?: Maybe<UpdateResourceResponse>;
  createPost?: Maybe<Post>;
  deletePost?: Maybe<DeleteResourceResponse>;
  likePost?: Maybe<UpdateResourceResponse>;
  loadMorePosts?: Maybe<Array<Post>>;
  addPeopleToConversation: Conversation;
  createConversation: Conversation;
  sendMessage: Message;
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationRegisterArgs = {
  name: Scalars["String"];
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationUpdateUserArgs = {
  userId: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
};

export type MutationUploadAvatarArgs = {
  file: Scalars["Upload"];
  userId: Scalars["ID"];
};

export type MutationFollowUserArgs = {
  id: Scalars["ID"];
};

export type MutationCreatePostArgs = {
  body: Scalars["String"];
  conversationId?: Maybe<Scalars["ID"]>;
  inReplyToId?: Maybe<Scalars["ID"]>;
};

export type MutationDeletePostArgs = {
  id: Scalars["ID"];
};

export type MutationLikePostArgs = {
  id: Scalars["ID"];
};

export type MutationLoadMorePostsArgs = {
  postId: Scalars["ID"];
};

export type MutationAddPeopleToConversationArgs = {
  conversationId?: Maybe<Scalars["ID"]>;
  userIds: Array<Scalars["ID"]>;
};

export type MutationCreateConversationArgs = {
  userIds: Array<Scalars["ID"]>;
};

export type MutationSendMessageArgs = {
  text: Scalars["String"];
  conversationId: Scalars["ID"];
  senderId: Scalars["ID"];
  receiverId?: Maybe<Scalars["String"]>;
};

export type UserLoginResult = UserLoginSuccess | UserLoginInvalidInputError;

export type UserLoginSuccess = {
  __typename?: "UserLoginSuccess";
  accessToken: Scalars["String"];
  node: User;
};

export type UserLoginInvalidInputError = Error & {
  __typename?: "UserLoginInvalidInputError";
  message: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type UserRegisterResult =
  | UserRegisterSuccess
  | UserRegisterInvalidInputError;

export type UserRegisterSuccess = {
  __typename?: "UserRegisterSuccess";
  node: User;
};

export type UserRegisterInvalidInputError = Error & {
  __typename?: "UserRegisterInvalidInputError";
  message: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
};

export type UserUpdateResult = UserUpdateSuccess | UserUpdateInvalidInputError;

export type UserUpdateSuccess = {
  __typename?: "UserUpdateSuccess";
  node: User;
};

export type UserUpdateInvalidInputError = Error & {
  __typename?: "UserUpdateInvalidInputError";
  message: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
};

export type UpdateResourceResponse = {
  __typename?: "UpdateResourceResponse";
  node?: Maybe<Node>;
  status?: Maybe<Scalars["Boolean"]>;
};

export type DeleteResourceResponse = {
  __typename?: "DeleteResourceResponse";
  node?: Maybe<Node>;
  status?: Maybe<Scalars["Boolean"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  _?: Maybe<Scalars["String"]>;
  messageSent?: Maybe<Message>;
};

export type SubscriptionMessageSentArgs = {
  conversationId: Scalars["ID"];
};

export enum Permission {
  OwnsAccount = "ownsAccount",
  OwnsPost = "ownsPost",
}

export type Member = {
  __typename?: "Member";
  userId: Scalars["String"];
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export type PostConversationFieldsFragment = { __typename?: "Post" } & {
  conversation?: Maybe<
    Array<{ __typename?: "Post" } & Pick<Post, "id" | "body">>
  >;
};

export type PostLikesFieldsFragment = { __typename?: "Post" } & Pick<
  Post,
  "id" | "isLiked" | "likesCount" | "replyCount"
> & { likes?: Maybe<Array<{ __typename?: "User" } & Pick<User, "id">>> };

export type UserAvatarFieldsFragment = { __typename?: "User" } & Pick<
  User,
  "avatar"
>;

export type UserFollowerFieldsFragment = { __typename?: "User" } & Pick<
  User,
  "isFollowed" | "followersCount" | "followingCount"
> & {
    followers?: Maybe<
      Array<
        { __typename?: "User" } & Pick<User, "id"> & UserAvatarFieldsFragment
      >
    >;
  };

export type AddPeopleToConversationMutationVariables = Exact<{
  conversationId?: Maybe<Scalars["ID"]>;
  userIds: Array<Scalars["ID"]> | Scalars["ID"];
}>;

export type AddPeopleToConversationMutation = { __typename?: "Mutation" } & {
  addPeopleToConversation: { __typename?: "Conversation" } & Pick<
    Conversation,
    "id" | "conversationId" | "type"
  > & {
      members?: Maybe<
        Array<
          { __typename?: "User" } & Pick<User, "username" | "id" | "avatar">
        >
      >;
    };
};

export type AuthUserQueryVariables = Exact<{ [key: string]: never }>;

export type AuthUserQuery = { __typename?: "Query" } & {
  authUser: { __typename?: "User" } & Pick<
    User,
    "id" | "username" | "email" | "name" | "bio" | "website"
  > &
    UserFollowerFieldsFragment &
    UserAvatarFieldsFragment;
};

export type ConversationQueryVariables = Exact<{
  conversationId: Scalars["ID"];
  postId: Scalars["ID"];
}>;

export type ConversationQuery = { __typename?: "Query" } & {
  conversation?: Maybe<
    Array<
      { __typename?: "Post" } & Pick<
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
        PostConversationFieldsFragment
    >
  >;
};

export type ConversationMessagesQueryVariables = Exact<{
  conversationId: Scalars["ID"];
}>;

export type ConversationMessagesQuery = { __typename?: "Query" } & {
  conversationMessages?: Maybe<
    Array<
      { __typename?: "Message" } & Pick<Message, "id" | "conversationId"> & {
          messagedata: { __typename?: "MessageData" } & Pick<
            MessageData,
            "id" | "text" | "conversationId" | "senderId"
          >;
        }
    >
  >;
};

export type CreatePostMutationVariables = Exact<{
  body: Scalars["String"];
  conversationId?: Maybe<Scalars["ID"]>;
  inReplyToId?: Maybe<Scalars["ID"]>;
}>;

export type CreatePostMutation = { __typename?: "Mutation" } & {
  createPost?: Maybe<
    { __typename?: "Post" } & Pick<
      Post,
      "id" | "body" | "conversationId" | "inReplyToId"
    > & {
        owner?: Maybe<
          { __typename?: "User" } & Pick<
            User,
            "id" | "username" | "name" | "email"
          > &
            UserAvatarFieldsFragment
        >;
      } & PostLikesFieldsFragment &
      PostConversationFieldsFragment
  >;
};

export type DeletePostMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeletePostMutation = { __typename?: "Mutation" } & {
  deletePost?: Maybe<
    { __typename?: "DeleteResourceResponse" } & Pick<
      DeleteResourceResponse,
      "status"
    >
  >;
};

export type FeedQueryVariables = Exact<{
  offset?: Maybe<Scalars["Int"]>;
}>;

export type FeedQuery = { __typename?: "Query" } & {
  feed: { __typename?: "FeedSuccess" } & Pick<FeedSuccess, "length"> & {
      feed?: Maybe<
        Array<
          { __typename?: "Post" } & Pick<
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
            PostConversationFieldsFragment
        >
      >;
    };
};

export type FollowUserMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type FollowUserMutation = { __typename?: "Mutation" } & {
  followUser?: Maybe<
    { __typename?: "UpdateResourceResponse" } & {
      node?: Maybe<
        | ({ __typename?: "User" } & Pick<User, "id"> &
            UserFollowerFieldsFragment &
            UserAvatarFieldsFragment)
        | { __typename?: "Post" }
      >;
    }
  >;
};

export type LoadMorePostsMutationVariables = Exact<{
  postId: Scalars["ID"];
}>;

export type LoadMorePostsMutation = { __typename?: "Mutation" } & {
  loadMorePosts?: Maybe<
    Array<
      { __typename?: "Post" } & Pick<
        Post,
        "id" | "body" | "conversationId" | "inReplyToId"
      > & {
          owner?: Maybe<
            { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "name" | "email"
            > &
              UserAvatarFieldsFragment
          >;
        } & PostLikesFieldsFragment &
        PostConversationFieldsFragment
    >
  >;
};

export type UserByNameQueryVariables = Exact<{
  username: Scalars["String"];
}>;

export type UserByNameQuery = { __typename?: "Query" } & {
  userByName:
    | ({ __typename?: "UserByNameSuccess" } & {
        node: { __typename?: "User" } & Pick<
          User,
          "id" | "email" | "username" | "name" | "bio" | "website"
        > &
          UserFollowerFieldsFragment &
          UserAvatarFieldsFragment;
      })
    | ({ __typename?: "UserByNameInvalidInputError" } & Pick<
        UserByNameInvalidInputError,
        "message" | "username"
      >);
};

export type SuggestedUsersQueryVariables = Exact<{ [key: string]: never }>;

export type SuggestedUsersQuery = { __typename?: "Query" } & {
  suggestedUsers?: Maybe<
    Array<
      { __typename?: "User" } & Pick<User, "id" | "username" | "name"> &
        UserAvatarFieldsFragment &
        UserFollowerFieldsFragment
    >
  >;
};

export type LikePostMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type LikePostMutation = { __typename?: "Mutation" } & {
  likePost?: Maybe<
    { __typename?: "UpdateResourceResponse" } & {
      node?: Maybe<
        | { __typename?: "User" }
        | ({ __typename?: "Post" } & PostLikesFieldsFragment)
      >;
    }
  >;
};

export type LikedPostsQueryVariables = Exact<{
  userId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
}>;

export type LikedPostsQuery = { __typename?: "Query" } & {
  likedPosts?: Maybe<
    Array<
      { __typename?: "Post" } & Pick<
        Post,
        "id" | "body" | "conversationId" | "inReplyToId"
      > & {
          owner?: Maybe<
            { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "name" | "email"
            > &
              UserAvatarFieldsFragment
          >;
        } & PostLikesFieldsFragment &
        PostConversationFieldsFragment
    >
  >;
};

export type LoginMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login?: Maybe<
    | ({ __typename: "UserLoginSuccess" } & Pick<
        UserLoginSuccess,
        "accessToken"
      > & {
          node: { __typename: "User" } & Pick<
            User,
            "id" | "username" | "email" | "bio" | "website" | "name"
          > &
            UserAvatarFieldsFragment &
            UserFollowerFieldsFragment;
        })
    | ({ __typename: "UserLoginInvalidInputError" } & Pick<
        UserLoginInvalidInputError,
        "email" | "password" | "message"
      >)
  >;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type MessageSentSubscriptionVariables = Exact<{
  conversationId: Scalars["ID"];
}>;

export type MessageSentSubscription = { __typename?: "Subscription" } & {
  messageSent?: Maybe<
    { __typename?: "Message" } & Pick<Message, "id" | "conversationId"> & {
        messagedata: { __typename?: "MessageData" } & Pick<
          MessageData,
          "text" | "id" | "conversationId" | "senderId"
        >;
      }
  >;
};

export type PostQueryVariables = Exact<{
  postId: Scalars["ID"];
}>;

export type PostQuery = { __typename?: "Query" } & {
  post:
    | ({ __typename?: "PostByIdSuccess" } & {
        node: { __typename?: "Post" } & Pick<
          Post,
          "id" | "body" | "conversationId" | "inReplyToId"
        > & {
            owner?: Maybe<
              { __typename?: "User" } & Pick<
                User,
                "id" | "username" | "name" | "email"
              > &
                UserAvatarFieldsFragment
            >;
          } & PostLikesFieldsFragment &
          PostConversationFieldsFragment;
      })
    | ({ __typename?: "PostByIdInvalidInputError" } & Pick<
        PostByIdInvalidInputError,
        "message" | "id"
      >);
};

export type PostsAndRepliesQueryVariables = Exact<{
  userId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
}>;

export type PostsAndRepliesQuery = { __typename?: "Query" } & {
  postsAndReplies?: Maybe<
    Array<
      { __typename?: "Post" } & Pick<
        Post,
        "id" | "body" | "conversationId" | "inReplyToId"
      > & {
          owner?: Maybe<
            { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "name" | "email"
            > &
              UserAvatarFieldsFragment
          >;
        } & PostLikesFieldsFragment &
        PostConversationFieldsFragment
    >
  >;
};

export type RegisterMutationVariables = Exact<{
  name: Scalars["String"];
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register:
    | ({ __typename: "UserRegisterSuccess" } & {
        node: { __typename?: "User" } & Pick<User, "id">;
      })
    | ({ __typename: "UserRegisterInvalidInputError" } & Pick<
        UserRegisterInvalidInputError,
        "email" | "username" | "name" | "password" | "message"
      >);
};

export type RepliesQueryVariables = Exact<{
  postId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
  loadMoreId?: Maybe<Scalars["ID"]>;
}>;

export type RepliesQuery = { __typename?: "Query" } & {
  replies?: Maybe<
    Array<
      { __typename?: "Post" } & Pick<
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
        PostConversationFieldsFragment
    >
  >;
};

export type SendMessageMutationVariables = Exact<{
  text: Scalars["String"];
  conversationId: Scalars["ID"];
  senderId: Scalars["ID"];
}>;

export type SendMessageMutation = { __typename?: "Mutation" } & {
  sendMessage: { __typename?: "Message" } & Pick<
    Message,
    "id" | "conversationId"
  > & {
      messagedata: { __typename?: "MessageData" } & Pick<
        MessageData,
        "text" | "id" | "conversationId" | "senderId"
      >;
    };
};

export type UpdateUserMutationVariables = Exact<{
  userId: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
}>;

export type UpdateUserMutation = { __typename?: "Mutation" } & {
  updateUser?: Maybe<
    | ({ __typename: "UserUpdateSuccess" } & {
        node: { __typename?: "User" } & Pick<
          User,
          "id" | "name" | "bio" | "website"
        > &
          UserFollowerFieldsFragment &
          UserAvatarFieldsFragment;
      })
    | ({ __typename: "UserUpdateInvalidInputError" } & Pick<
        UserUpdateInvalidInputError,
        "name" | "bio" | "website" | "message"
      >)
  >;
};

export type UploadAvatarMutationVariables = Exact<{
  file: Scalars["Upload"];
  userId: Scalars["ID"];
}>;

export type UploadAvatarMutation = { __typename?: "Mutation" } & {
  uploadAvatar?: Maybe<
    { __typename?: "UpdateResourceResponse" } & Pick<
      UpdateResourceResponse,
      "status"
    > & {
        node?: Maybe<
          | ({ __typename?: "User" } & Pick<
              User,
              "id" | "name" | "username" | "email"
            > &
              UserAvatarFieldsFragment)
          | { __typename?: "Post" }
        >;
      }
  >;
};

export type UserConversationsQueryVariables = Exact<{ [key: string]: never }>;

export type UserConversationsQuery = { __typename?: "Query" } & {
  userConversations?: Maybe<
    Array<
      { __typename?: "Conversation" } & Pick<
        Conversation,
        "id" | "conversationId" | "type"
      > & {
          members?: Maybe<
            Array<
              { __typename?: "User" } & Pick<User, "username" | "id" | "avatar">
            >
          >;
        }
    >
  >;
};

export type UserPostsQueryVariables = Exact<{
  userId: Scalars["ID"];
  offset?: Maybe<Scalars["Int"]>;
}>;

export type UserPostsQuery = { __typename?: "Query" } & {
  userPosts?: Maybe<
    Array<
      { __typename?: "Post" } & Pick<
        Post,
        "id" | "body" | "conversationId" | "inReplyToId"
      > & {
          owner?: Maybe<
            { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "name" | "email"
            > &
              UserAvatarFieldsFragment
          >;
        } & PostLikesFieldsFragment &
        PostConversationFieldsFragment
    >
  >;
};

export const PostConversationFieldsFragmentDoc = gql`
  fragment postConversationFields on Post {
    conversation {
      id
      body
    }
  }
`;
export const PostLikesFieldsFragmentDoc = gql`
  fragment postLikesFields on Post {
    id
    isLiked @client
    likesCount
    replyCount
    likes {
      id
    }
  }
`;
export const UserAvatarFieldsFragmentDoc = gql`
  fragment userAvatarFields on User {
    avatar
  }
`;
export const UserFollowerFieldsFragmentDoc = gql`
  fragment userFollowerFields on User {
    isFollowed @client
    followersCount
    followingCount
    followers {
      id
      ...userAvatarFields
    }
  }
  ${UserAvatarFieldsFragmentDoc}
`;
export const AddPeopleToConversationDocument = gql`
  mutation addPeopleToConversation($conversationId: ID, $userIds: [ID!]!) {
    addPeopleToConversation(
      conversationId: $conversationId
      userIds: $userIds
    ) {
      id
      conversationId
      type
      members {
        username
        id
        avatar
      }
    }
  }
`;
export type AddPeopleToConversationMutationFn = ApolloReactCommon.MutationFunction<
  AddPeopleToConversationMutation,
  AddPeopleToConversationMutationVariables
>;

/**
 * __useAddPeopleToConversationMutation__
 *
 * To run a mutation, you first call `useAddPeopleToConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPeopleToConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPeopleToConversationMutation, { data, loading, error }] = useAddPeopleToConversationMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useAddPeopleToConversationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddPeopleToConversationMutation,
    AddPeopleToConversationMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddPeopleToConversationMutation,
    AddPeopleToConversationMutationVariables
  >(AddPeopleToConversationDocument, baseOptions);
}
export type AddPeopleToConversationMutationHookResult = ReturnType<
  typeof useAddPeopleToConversationMutation
>;
export type AddPeopleToConversationMutationResult = ApolloReactCommon.MutationResult<AddPeopleToConversationMutation>;
export type AddPeopleToConversationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddPeopleToConversationMutation,
  AddPeopleToConversationMutationVariables
>;
export const AuthUserDocument = gql`
  query authUser {
    authUser {
      id
      username
      email
      name
      bio
      website
      ...userFollowerFields
      ...userAvatarFields
    }
  }
  ${UserFollowerFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useAuthUserQuery__
 *
 * To run a query within a React component, call `useAuthUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuthUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AuthUserQuery,
    AuthUserQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<AuthUserQuery, AuthUserQueryVariables>(
    AuthUserDocument,
    baseOptions
  );
}
export function useAuthUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AuthUserQuery,
    AuthUserQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<AuthUserQuery, AuthUserQueryVariables>(
    AuthUserDocument,
    baseOptions
  );
}
export type AuthUserQueryHookResult = ReturnType<typeof useAuthUserQuery>;
export type AuthUserLazyQueryHookResult = ReturnType<
  typeof useAuthUserLazyQuery
>;
export type AuthUserQueryResult = ApolloReactCommon.QueryResult<
  AuthUserQuery,
  AuthUserQueryVariables
>;
export const ConversationDocument = gql`
  query conversation($conversationId: ID!, $postId: ID!) {
    conversation(conversationId: $conversationId, postId: $postId) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
        ...userFollowerFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
  ${UserFollowerFieldsFragmentDoc}
`;

/**
 * __useConversationQuery__
 *
 * To run a query within a React component, call `useConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useConversationQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ConversationQuery,
    ConversationQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ConversationQuery,
    ConversationQueryVariables
  >(ConversationDocument, baseOptions);
}
export function useConversationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ConversationQuery,
    ConversationQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ConversationQuery,
    ConversationQueryVariables
  >(ConversationDocument, baseOptions);
}
export type ConversationQueryHookResult = ReturnType<
  typeof useConversationQuery
>;
export type ConversationLazyQueryHookResult = ReturnType<
  typeof useConversationLazyQuery
>;
export type ConversationQueryResult = ApolloReactCommon.QueryResult<
  ConversationQuery,
  ConversationQueryVariables
>;
export const ConversationMessagesDocument = gql`
  query conversationMessages($conversationId: ID!) {
    conversationMessages(conversationId: $conversationId) {
      id
      conversationId
      messagedata {
        id
        text
        conversationId
        senderId
      }
    }
  }
`;

/**
 * __useConversationMessagesQuery__
 *
 * To run a query within a React component, call `useConversationMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationMessagesQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useConversationMessagesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ConversationMessagesQuery,
    ConversationMessagesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    ConversationMessagesQuery,
    ConversationMessagesQueryVariables
  >(ConversationMessagesDocument, baseOptions);
}
export function useConversationMessagesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ConversationMessagesQuery,
    ConversationMessagesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    ConversationMessagesQuery,
    ConversationMessagesQueryVariables
  >(ConversationMessagesDocument, baseOptions);
}
export type ConversationMessagesQueryHookResult = ReturnType<
  typeof useConversationMessagesQuery
>;
export type ConversationMessagesLazyQueryHookResult = ReturnType<
  typeof useConversationMessagesLazyQuery
>;
export type ConversationMessagesQueryResult = ApolloReactCommon.QueryResult<
  ConversationMessagesQuery,
  ConversationMessagesQueryVariables
>;
export const CreatePostDocument = gql`
  mutation createPost($body: String!, $conversationId: ID, $inReplyToId: ID) {
    createPost(
      body: $body
      inReplyToId: $inReplyToId
      conversationId: $conversationId
    ) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;
export type CreatePostMutationFn = ApolloReactCommon.MutationFunction<
  CreatePostMutation,
  CreatePostMutationVariables
>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      body: // value for 'body'
 *      conversationId: // value for 'conversationId'
 *      inReplyToId: // value for 'inReplyToId'
 *   },
 * });
 */
export function useCreatePostMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreatePostMutation,
    CreatePostMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreatePostMutation,
    CreatePostMutationVariables
  >(CreatePostDocument, baseOptions);
}
export type CreatePostMutationHookResult = ReturnType<
  typeof useCreatePostMutation
>;
export type CreatePostMutationResult = ApolloReactCommon.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreatePostMutation,
  CreatePostMutationVariables
>;
export const DeletePostDocument = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      status
    }
  }
`;
export type DeletePostMutationFn = ApolloReactCommon.MutationFunction<
  DeletePostMutation,
  DeletePostMutationVariables
>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeletePostMutation,
    DeletePostMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(DeletePostDocument, baseOptions);
}
export type DeletePostMutationHookResult = ReturnType<
  typeof useDeletePostMutation
>;
export type DeletePostMutationResult = ApolloReactCommon.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeletePostMutation,
  DeletePostMutationVariables
>;
export const FeedDocument = gql`
  query feed($offset: Int) {
    feed(offset: $offset) {
      feed {
        id
        body
        conversationId
        inReplyToId
        ...postLikesFields
        ...postConversationFields
        owner {
          id
          username
          name
          email
          ...userAvatarFields
          ...userFollowerFields
        }
      }
      length
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
  ${UserFollowerFieldsFragmentDoc}
`;

/**
 * __useFeedQuery__
 *
 * To run a query within a React component, call `useFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useFeedQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  return ApolloReactHooks.useQuery<FeedQuery, FeedQueryVariables>(
    FeedDocument,
    baseOptions
  );
}
export function useFeedLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FeedQuery,
    FeedQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<FeedQuery, FeedQueryVariables>(
    FeedDocument,
    baseOptions
  );
}
export type FeedQueryHookResult = ReturnType<typeof useFeedQuery>;
export type FeedLazyQueryHookResult = ReturnType<typeof useFeedLazyQuery>;
export type FeedQueryResult = ApolloReactCommon.QueryResult<
  FeedQuery,
  FeedQueryVariables
>;
export const FollowUserDocument = gql`
  mutation followUser($id: ID!) {
    followUser(id: $id) {
      node {
        ... on User {
          id
          ...userFollowerFields
          ...userAvatarFields
        }
      }
    }
  }
  ${UserFollowerFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;
export type FollowUserMutationFn = ApolloReactCommon.MutationFunction<
  FollowUserMutation,
  FollowUserMutationVariables
>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFollowUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    FollowUserMutation,
    FollowUserMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    FollowUserMutation,
    FollowUserMutationVariables
  >(FollowUserDocument, baseOptions);
}
export type FollowUserMutationHookResult = ReturnType<
  typeof useFollowUserMutation
>;
export type FollowUserMutationResult = ApolloReactCommon.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  FollowUserMutation,
  FollowUserMutationVariables
>;
export const LoadMorePostsDocument = gql`
  mutation loadMorePosts($postId: ID!) {
    loadMorePosts(postId: $postId) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;
export type LoadMorePostsMutationFn = ApolloReactCommon.MutationFunction<
  LoadMorePostsMutation,
  LoadMorePostsMutationVariables
>;

/**
 * __useLoadMorePostsMutation__
 *
 * To run a mutation, you first call `useLoadMorePostsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoadMorePostsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loadMorePostsMutation, { data, loading, error }] = useLoadMorePostsMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useLoadMorePostsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LoadMorePostsMutation,
    LoadMorePostsMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    LoadMorePostsMutation,
    LoadMorePostsMutationVariables
  >(LoadMorePostsDocument, baseOptions);
}
export type LoadMorePostsMutationHookResult = ReturnType<
  typeof useLoadMorePostsMutation
>;
export type LoadMorePostsMutationResult = ApolloReactCommon.MutationResult<LoadMorePostsMutation>;
export type LoadMorePostsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoadMorePostsMutation,
  LoadMorePostsMutationVariables
>;
export const UserByNameDocument = gql`
  query userByName($username: String!) {
    userByName(username: $username) {
      ... on UserByNameSuccess {
        node {
          ... on User {
            id
            email
            username
            name
            bio
            website
            ...userFollowerFields
            ...userAvatarFields
          }
        }
      }
      ... on UserByNameInvalidInputError {
        message
        username
      }
    }
  }
  ${UserFollowerFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useUserByNameQuery__
 *
 * To run a query within a React component, call `useUserByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserByNameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUserByNameQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserByNameQuery,
    UserByNameQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<UserByNameQuery, UserByNameQueryVariables>(
    UserByNameDocument,
    baseOptions
  );
}
export function useUserByNameLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserByNameQuery,
    UserByNameQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    UserByNameQuery,
    UserByNameQueryVariables
  >(UserByNameDocument, baseOptions);
}
export type UserByNameQueryHookResult = ReturnType<typeof useUserByNameQuery>;
export type UserByNameLazyQueryHookResult = ReturnType<
  typeof useUserByNameLazyQuery
>;
export type UserByNameQueryResult = ApolloReactCommon.QueryResult<
  UserByNameQuery,
  UserByNameQueryVariables
>;
export const SuggestedUsersDocument = gql`
  query suggestedUsers {
    suggestedUsers {
      id
      username
      name
      ...userAvatarFields
      ...userFollowerFields
    }
  }
  ${UserAvatarFieldsFragmentDoc}
  ${UserFollowerFieldsFragmentDoc}
`;

/**
 * __useSuggestedUsersQuery__
 *
 * To run a query within a React component, call `useSuggestedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuggestedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuggestedUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useSuggestedUsersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SuggestedUsersQuery,
    SuggestedUsersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    SuggestedUsersQuery,
    SuggestedUsersQueryVariables
  >(SuggestedUsersDocument, baseOptions);
}
export function useSuggestedUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SuggestedUsersQuery,
    SuggestedUsersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    SuggestedUsersQuery,
    SuggestedUsersQueryVariables
  >(SuggestedUsersDocument, baseOptions);
}
export type SuggestedUsersQueryHookResult = ReturnType<
  typeof useSuggestedUsersQuery
>;
export type SuggestedUsersLazyQueryHookResult = ReturnType<
  typeof useSuggestedUsersLazyQuery
>;
export type SuggestedUsersQueryResult = ApolloReactCommon.QueryResult<
  SuggestedUsersQuery,
  SuggestedUsersQueryVariables
>;
export const LikePostDocument = gql`
  mutation likePost($id: ID!) {
    likePost(id: $id) {
      node {
        ... on Post {
          ...postLikesFields
        }
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
`;
export type LikePostMutationFn = ApolloReactCommon.MutationFunction<
  LikePostMutation,
  LikePostMutationVariables
>;

/**
 * __useLikePostMutation__
 *
 * To run a mutation, you first call `useLikePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likePostMutation, { data, loading, error }] = useLikePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLikePostMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LikePostMutation,
    LikePostMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    LikePostMutation,
    LikePostMutationVariables
  >(LikePostDocument, baseOptions);
}
export type LikePostMutationHookResult = ReturnType<typeof useLikePostMutation>;
export type LikePostMutationResult = ApolloReactCommon.MutationResult<LikePostMutation>;
export type LikePostMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LikePostMutation,
  LikePostMutationVariables
>;
export const LikedPostsDocument = gql`
  query likedPosts($userId: ID!, $offset: Int) {
    likedPosts(userId: $userId, offset: $offset) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useLikedPostsQuery__
 *
 * To run a query within a React component, call `useLikedPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLikedPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLikedPostsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useLikedPostsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LikedPostsQuery,
    LikedPostsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<LikedPostsQuery, LikedPostsQueryVariables>(
    LikedPostsDocument,
    baseOptions
  );
}
export function useLikedPostsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LikedPostsQuery,
    LikedPostsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    LikedPostsQuery,
    LikedPostsQueryVariables
  >(LikedPostsDocument, baseOptions);
}
export type LikedPostsQueryHookResult = ReturnType<typeof useLikedPostsQuery>;
export type LikedPostsLazyQueryHookResult = ReturnType<
  typeof useLikedPostsLazyQuery
>;
export type LikedPostsQueryResult = ApolloReactCommon.QueryResult<
  LikedPostsQuery,
  LikedPostsQueryVariables
>;
export const LoginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on UserLoginSuccess {
        __typename
        node {
          ... on User {
            __typename
            id
            username
            email
            bio
            website
            name
            ...userAvatarFields
            ...userFollowerFields
          }
        }
        accessToken
      }
      ... on UserLoginInvalidInputError {
        __typename
        email
        password
        message
      }
      ... on Error {
        __typename
        message
      }
    }
  }
  ${UserAvatarFieldsFragmentDoc}
  ${UserFollowerFieldsFragmentDoc}
`;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    baseOptions
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const MessageSentDocument = gql`
  subscription messageSent($conversationId: ID!) {
    messageSent(conversationId: $conversationId) {
      id
      conversationId
      messagedata {
        text
        id
        conversationId
        senderId
      }
    }
  }
`;

/**
 * __useMessageSentSubscription__
 *
 * To run a query within a React component, call `useMessageSentSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageSentSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageSentSubscription({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useMessageSentSubscription(
  baseOptions?: ApolloReactHooks.SubscriptionHookOptions<
    MessageSentSubscription,
    MessageSentSubscriptionVariables
  >
) {
  return ApolloReactHooks.useSubscription<
    MessageSentSubscription,
    MessageSentSubscriptionVariables
  >(MessageSentDocument, baseOptions);
}
export type MessageSentSubscriptionHookResult = ReturnType<
  typeof useMessageSentSubscription
>;
export type MessageSentSubscriptionResult = ApolloReactCommon.SubscriptionResult<MessageSentSubscription>;
export const PostDocument = gql`
  query post($postId: ID!) {
    post(postId: $postId) {
      ... on PostByIdSuccess {
        node {
          ... on Post {
            id
            body
            conversationId
            inReplyToId
            ...postLikesFields
            ...postConversationFields
            owner {
              id
              username
              name
              email
              ...userAvatarFields
            }
          }
        }
      }
      ... on PostByIdInvalidInputError {
        message
        id
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function usePostQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<PostQuery, PostQueryVariables>
) {
  return ApolloReactHooks.useQuery<PostQuery, PostQueryVariables>(
    PostDocument,
    baseOptions
  );
}
export function usePostLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PostQuery,
    PostQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<PostQuery, PostQueryVariables>(
    PostDocument,
    baseOptions
  );
}
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = ApolloReactCommon.QueryResult<
  PostQuery,
  PostQueryVariables
>;
export const PostsAndRepliesDocument = gql`
  query postsAndReplies($userId: ID!, $offset: Int) {
    postsAndReplies(userId: $userId, offset: $offset) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __usePostsAndRepliesQuery__
 *
 * To run a query within a React component, call `usePostsAndRepliesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsAndRepliesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsAndRepliesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function usePostsAndRepliesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    PostsAndRepliesQuery,
    PostsAndRepliesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    PostsAndRepliesQuery,
    PostsAndRepliesQueryVariables
  >(PostsAndRepliesDocument, baseOptions);
}
export function usePostsAndRepliesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PostsAndRepliesQuery,
    PostsAndRepliesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    PostsAndRepliesQuery,
    PostsAndRepliesQueryVariables
  >(PostsAndRepliesDocument, baseOptions);
}
export type PostsAndRepliesQueryHookResult = ReturnType<
  typeof usePostsAndRepliesQuery
>;
export type PostsAndRepliesLazyQueryHookResult = ReturnType<
  typeof usePostsAndRepliesLazyQuery
>;
export type PostsAndRepliesQueryResult = ApolloReactCommon.QueryResult<
  PostsAndRepliesQuery,
  PostsAndRepliesQueryVariables
>;
export const RegisterDocument = gql`
  mutation Register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      __typename
      ... on UserRegisterSuccess {
        node {
          ... on User {
            id
          }
        }
      }
      ... on UserRegisterInvalidInputError {
        email
        username
        name
        password
      }
      ... on Error {
        message
      }
    }
  }
`;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(RegisterDocument, baseOptions);
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const RepliesDocument = gql`
  query replies($postId: ID!, $offset: Int, $loadMoreId: ID) {
    replies(postId: $postId, offset: $offset, loadMoreId: $loadMoreId) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
        ...userFollowerFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
  ${UserFollowerFieldsFragmentDoc}
`;

/**
 * __useRepliesQuery__
 *
 * To run a query within a React component, call `useRepliesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRepliesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRepliesQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *      offset: // value for 'offset'
 *      loadMoreId: // value for 'loadMoreId'
 *   },
 * });
 */
export function useRepliesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RepliesQuery,
    RepliesQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<RepliesQuery, RepliesQueryVariables>(
    RepliesDocument,
    baseOptions
  );
}
export function useRepliesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    RepliesQuery,
    RepliesQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<RepliesQuery, RepliesQueryVariables>(
    RepliesDocument,
    baseOptions
  );
}
export type RepliesQueryHookResult = ReturnType<typeof useRepliesQuery>;
export type RepliesLazyQueryHookResult = ReturnType<typeof useRepliesLazyQuery>;
export type RepliesQueryResult = ApolloReactCommon.QueryResult<
  RepliesQuery,
  RepliesQueryVariables
>;
export const SendMessageDocument = gql`
  mutation sendMessage($text: String!, $conversationId: ID!, $senderId: ID!) {
    sendMessage(
      text: $text
      conversationId: $conversationId
      senderId: $senderId
    ) {
      id
      conversationId
      messagedata {
        text
        id
        conversationId
        senderId
      }
    }
  }
`;
export type SendMessageMutationFn = ApolloReactCommon.MutationFunction<
  SendMessageMutation,
  SendMessageMutationVariables
>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      text: // value for 'text'
 *      conversationId: // value for 'conversationId'
 *      senderId: // value for 'senderId'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SendMessageDocument, baseOptions);
}
export type SendMessageMutationHookResult = ReturnType<
  typeof useSendMessageMutation
>;
export type SendMessageMutationResult = ApolloReactCommon.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>;
export const UpdateUserDocument = gql`
  mutation UpdateUser(
    $userId: ID!
    $name: String
    $bio: String
    $website: String
  ) {
    updateUser(userId: $userId, name: $name, bio: $bio, website: $website) {
      __typename
      ... on UserUpdateSuccess {
        node {
          ... on User {
            id
            name
            bio
            website
            ...userFollowerFields
            ...userAvatarFields
          }
        }
      }
      ... on UserUpdateInvalidInputError {
        name
        bio
        website
        message
      }
    }
  }
  ${UserFollowerFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      name: // value for 'name'
 *      bio: // value for 'bio'
 *      website: // value for 'website'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UpdateUserDocument, baseOptions);
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
export const UploadAvatarDocument = gql`
  mutation uploadAvatar($file: Upload!, $userId: ID!) {
    uploadAvatar(file: $file, userId: $userId) {
      status
      node {
        ... on User {
          id
          name
          username
          email
          ...userAvatarFields
        }
      }
    }
  }
  ${UserAvatarFieldsFragmentDoc}
`;
export type UploadAvatarMutationFn = ApolloReactCommon.MutationFunction<
  UploadAvatarMutation,
  UploadAvatarMutationVariables
>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      file: // value for 'file'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUploadAvatarMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UploadAvatarMutation,
    UploadAvatarMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UploadAvatarMutation,
    UploadAvatarMutationVariables
  >(UploadAvatarDocument, baseOptions);
}
export type UploadAvatarMutationHookResult = ReturnType<
  typeof useUploadAvatarMutation
>;
export type UploadAvatarMutationResult = ApolloReactCommon.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UploadAvatarMutation,
  UploadAvatarMutationVariables
>;
export const UserConversationsDocument = gql`
  query userConversations {
    userConversations {
      id
      conversationId
      type
      members {
        username
        id
        avatar
      }
    }
  }
`;

/**
 * __useUserConversationsQuery__
 *
 * To run a query within a React component, call `useUserConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConversationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserConversationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserConversationsQuery,
    UserConversationsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    UserConversationsQuery,
    UserConversationsQueryVariables
  >(UserConversationsDocument, baseOptions);
}
export function useUserConversationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserConversationsQuery,
    UserConversationsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    UserConversationsQuery,
    UserConversationsQueryVariables
  >(UserConversationsDocument, baseOptions);
}
export type UserConversationsQueryHookResult = ReturnType<
  typeof useUserConversationsQuery
>;
export type UserConversationsLazyQueryHookResult = ReturnType<
  typeof useUserConversationsLazyQuery
>;
export type UserConversationsQueryResult = ApolloReactCommon.QueryResult<
  UserConversationsQuery,
  UserConversationsQueryVariables
>;
export const UserPostsDocument = gql`
  query userPosts($userId: ID!, $offset: Int) {
    userPosts(userId: $userId, offset: $offset) {
      id
      body
      conversationId
      inReplyToId
      ...postLikesFields
      ...postConversationFields
      owner {
        id
        username
        name
        email
        ...userAvatarFields
      }
    }
  }
  ${PostLikesFieldsFragmentDoc}
  ${PostConversationFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useUserPostsQuery__
 *
 * To run a query within a React component, call `useUserPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPostsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useUserPostsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserPostsQuery,
    UserPostsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<UserPostsQuery, UserPostsQueryVariables>(
    UserPostsDocument,
    baseOptions
  );
}
export function useUserPostsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserPostsQuery,
    UserPostsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<UserPostsQuery, UserPostsQueryVariables>(
    UserPostsDocument,
    baseOptions
  );
}
export type UserPostsQueryHookResult = ReturnType<typeof useUserPostsQuery>;
export type UserPostsLazyQueryHookResult = ReturnType<
  typeof useUserPostsLazyQuery
>;
export type UserPostsQueryResult = ApolloReactCommon.QueryResult<
  UserPostsQuery,
  UserPostsQueryVariables
>;
