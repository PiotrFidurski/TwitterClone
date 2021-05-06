import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Node: [
      "User",
      "Tweet",
      "Conversation",
      "LeftConversationAt",
      "LastSeenMessage",
    ],
    UserByNameResult: ["UserByNameSuccess", "UserByNameInvalidInputError"],
    Error: [
      "UserByNameInvalidInputError",
      "ConversationInvalidInputError",
      "TweetInvalidInputError",
      "TweetsInvalidInputError",
      "MessagesInvalidInputError",
      "LeftAtInvalidInputError",
      "UserLoginInvalidInputError",
      "UserRegisterInvalidInputError",
      "UserUpdateInvalidInputError",
      "FollowUserInvalidInputError",
      "RepliesToTweetInvalidInputError",
      "CreateTweetInvalidInputError",
      "DeleteTweetInvalidInputError",
      "LikeTweetInvalidInputError",
      "SendMessageInvalidInputError",
      "MessageUserInvalidInputError",
      "ReadConversationInvalidInputError",
      "LeaveConversationInvalidInputError",
      "SeeMessageInvalidInputError",
    ],
    ConversationResult: [
      "ConversationSuccess",
      "ConversationInvalidInputError",
    ],
    TweetResult: ["TweetSuccess", "TweetInvalidInputError"],
    TweetsResult: ["TweetConnection", "TweetsInvalidInputError"],
    MessagesResult: ["MessagesConnection", "MessagesInvalidInputError"],
    LeftAtResult: ["LeftAtSuccess", "LeftAtInvalidInputError"],
    UserLoginResult: ["UserLoginSuccess", "UserLoginInvalidInputError"],
    UserRegisterResult: [
      "UserRegisterSuccess",
      "UserRegisterInvalidInputError",
    ],
    UserUpdateResult: ["UserUpdateSuccess", "UserUpdateInvalidInputError"],
    FollowUserResult: ["UpdateResourceResponse", "FollowUserInvalidInputError"],
    RepliesToTweetResult: [
      "RepliesToTweetSuccess",
      "RepliesToTweetInvalidInputError",
    ],
    CreateTweetResult: ["Tweet", "CreateTweetInvalidInputError"],
    DeleteTweetResult: [
      "DeleteResourceResponse",
      "DeleteTweetInvalidInputError",
    ],
    LikeTweetResult: ["UpdateResourceResponse", "LikeTweetInvalidInputError"],
    SendMessageResult: ["SendMessageSuccess", "SendMessageInvalidInputError"],
    MessageUserResult: ["MessageUserSuccess", "MessageUserInvalidInputError"],
    ReadConversationResult: [
      "UpdateResourceResponse",
      "ReadConversationInvalidInputError",
    ],
    LeaveConversationResult: [
      "UpdateResourceResponse",
      "LeaveConversationInvalidInputError",
    ],
    SeeMessageResult: ["UpdateResourceResponse", "SeeMessageInvalidInputError"],
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
  authUser: User;
  userByName: UserByNameResult;
  randomUsers?: Maybe<Array<User>>;
  feed: TweetConnection;
  conversation: ConversationResult;
  tweet: TweetResult;
  replies: TweetsResult;
  userTweets: TweetsResult;
  userLikedTweets: TweetsResult;
  userTweetsAndReplies: TweetsResult;
  messages: MessagesResult;
  userInbox?: Maybe<UserinboxResult>;
  leftAt: LeftAtResult;
};

export type QueryNodeArgs = {
  id?: Maybe<Scalars["ID"]>;
};

export type QueryUserByNameArgs = {
  username: Scalars["String"];
};

export type QueryRandomUsersArgs = {
  userId: Scalars["String"];
};

export type QueryFeedArgs = {
  after?: Maybe<Scalars["String"]>;
};

export type QueryConversationArgs = {
  conversationId: Scalars["ID"];
  tweetId: Scalars["ID"];
};

export type QueryTweetArgs = {
  tweetId?: Maybe<Scalars["ID"]>;
};

export type QueryRepliesArgs = {
  tweetId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
};

export type QueryUserTweetsArgs = {
  userId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
};

export type QueryUserLikedTweetsArgs = {
  userId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
};

export type QueryUserTweetsAndRepliesArgs = {
  userId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
};

export type QueryMessagesArgs = {
  conversationId: Scalars["String"];
  cursorId?: Maybe<Scalars["String"]>;
  limit: Scalars["Int"];
  leftAtMessageId?: Maybe<Scalars["String"]>;
};

export type QueryLeftAtArgs = {
  userId: Scalars["String"];
  conversationId: Scalars["String"];
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
  lastReadMessageId?: Maybe<Scalars["String"]>;
  lastSeenMessageId?: Maybe<Scalars["String"]>;
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

export type TweetConnection = {
  __typename?: "TweetConnection";
  count: Scalars["Int"];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Tweet>>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  hasPreviousPage: Scalars["Boolean"];
  hasNextPage: Scalars["Boolean"];
  startCursor: Scalars["String"];
  endCursor: Scalars["String"];
};

export type Tweet = Node & {
  __typename?: "Tweet";
  body: Scalars["String"];
  conversation?: Maybe<Array<Tweet>>;
  conversationId?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  inReplyToId?: Maybe<Scalars["String"]>;
  inReplyToUsername?: Maybe<Scalars["String"]>;
  isLiked?: Maybe<Scalars["Boolean"]>;
  likes?: Maybe<Array<User>>;
  likesCount?: Maybe<Scalars["Int"]>;
  owner?: Maybe<User>;
  replyCount?: Maybe<Scalars["Int"]>;
};

export type ConversationResult =
  | ConversationSuccess
  | ConversationInvalidInputError;

export type ConversationSuccess = {
  __typename?: "ConversationSuccess";
  edges?: Maybe<Array<Tweet>>;
};

export type ConversationInvalidInputError = Error & {
  __typename?: "ConversationInvalidInputError";
  message: Scalars["String"];
  tweetId?: Maybe<Scalars["String"]>;
  conversationId?: Maybe<Scalars["String"]>;
};

export type TweetResult = TweetSuccess | TweetInvalidInputError;

export type TweetSuccess = {
  __typename?: "TweetSuccess";
  node: Tweet;
};

export type TweetInvalidInputError = Error & {
  __typename?: "TweetInvalidInputError";
  message: Scalars["String"];
  tweetId?: Maybe<Scalars["String"]>;
};

export type TweetsResult = TweetConnection | TweetsInvalidInputError;

export type TweetsInvalidInputError = Error & {
  __typename?: "TweetsInvalidInputError";
  message: Scalars["String"];
  after?: Maybe<Scalars["String"]>;
  userId?: Maybe<Scalars["String"]>;
  tweetId?: Maybe<Scalars["String"]>;
};

export type MessagesResult = MessagesConnection | MessagesInvalidInputError;

export type MessagesConnection = {
  __typename?: "MessagesConnection";
  conversation: Conversation;
  edges?: Maybe<Array<MessageEdge>>;
  pageInfo: PageInfo;
};

export type Conversation = Node & {
  __typename?: "Conversation";
  id: Scalars["ID"];
  conversationId?: Maybe<Scalars["String"]>;
  lastReadMessageId?: Maybe<Scalars["String"]>;
  mostRecentEntryId?: Maybe<Scalars["String"]>;
  oldestEntryId?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  messages_conversation?: Maybe<Array<Message>>;
  participants?: Maybe<Array<Participants>>;
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

export type Participants = {
  __typename?: "Participants";
  userId: Scalars["String"];
  lastReadMessageId?: Maybe<Scalars["String"]>;
};

export type MessageEdge = {
  __typename?: "MessageEdge";
  cursor: Scalars["String"];
  node: Message;
};

export type MessagesInvalidInputError = Error & {
  __typename?: "MessagesInvalidInputError";
  message: Scalars["String"];
  conversationId?: Maybe<Scalars["String"]>;
  cursorId?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  leftAtMessageId?: Maybe<Scalars["String"]>;
};

export type UserinboxResult = {
  __typename?: "UserinboxResult";
  conversations?: Maybe<Array<Conversation>>;
  users?: Maybe<Array<User>>;
  lastSeenMessageId?: Maybe<Scalars["String"]>;
  userId?: Maybe<Scalars["String"]>;
};

export type LeftAtResult = LeftAtSuccess | LeftAtInvalidInputError;

export type LeftAtSuccess = {
  __typename?: "LeftAtSuccess";
  node: LeftConversationAt;
};

export type LeftConversationAt = Node & {
  __typename?: "LeftConversationAt";
  userId?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  conversationId?: Maybe<Scalars["String"]>;
  leftAtMessageId?: Maybe<Scalars["String"]>;
};

export type LeftAtInvalidInputError = Error & {
  __typename?: "LeftAtInvalidInputError";
  message: Scalars["String"];
  userId?: Maybe<Scalars["String"]>;
  conversationId?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["String"]>;
  login?: Maybe<UserLoginResult>;
  register: UserRegisterResult;
  logout?: Maybe<Scalars["Boolean"]>;
  updateUser?: Maybe<UserUpdateResult>;
  uploadAvatar?: Maybe<UpdateResourceResponse>;
  followUser?: Maybe<FollowUserResult>;
  repliesToTweet: RepliesToTweetResult;
  createTweet?: Maybe<CreateTweetResult>;
  deleteTweet?: Maybe<DeleteTweetResult>;
  likeTweet?: Maybe<LikeTweetResult>;
  sendMessage: SendMessageResult;
  messageUser: MessageUserResult;
  readConversation: ReadConversationResult;
  leaveConversation: LeaveConversationResult;
  seeMessage: SeeMessageResult;
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
  userId: Scalars["ID"];
};

export type MutationRepliesToTweetArgs = {
  tweetId: Scalars["ID"];
};

export type MutationCreateTweetArgs = {
  body: Scalars["String"];
  conversationId?: Maybe<Scalars["ID"]>;
  inReplyToId?: Maybe<Scalars["ID"]>;
};

export type MutationDeleteTweetArgs = {
  tweetId: Scalars["ID"];
};

export type MutationLikeTweetArgs = {
  tweetId: Scalars["ID"];
};

export type MutationSendMessageArgs = {
  text: Scalars["String"];
  conversationId: Scalars["String"];
  senderId: Scalars["ID"];
  receiverId?: Maybe<Scalars["String"]>;
};

export type MutationMessageUserArgs = {
  userId: Scalars["ID"];
};

export type MutationReadConversationArgs = {
  conversationId: Scalars["String"];
  messageId: Scalars["String"];
};

export type MutationLeaveConversationArgs = {
  conversationId: Scalars["String"];
};

export type MutationSeeMessageArgs = {
  messageId: Scalars["String"];
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
  userId?: Maybe<Scalars["String"]>;
};

export type UpdateResourceResponse = {
  __typename?: "UpdateResourceResponse";
  node?: Maybe<Node>;
  status?: Maybe<Scalars["Boolean"]>;
};

export type FollowUserResult =
  | UpdateResourceResponse
  | FollowUserInvalidInputError;

export type FollowUserInvalidInputError = Error & {
  __typename?: "FollowUserInvalidInputError";
  message: Scalars["String"];
  userId?: Maybe<Scalars["String"]>;
};

export type RepliesToTweetResult =
  | RepliesToTweetSuccess
  | RepliesToTweetInvalidInputError;

export type RepliesToTweetSuccess = {
  __typename?: "RepliesToTweetSuccess";
  edges?: Maybe<Array<Tweet>>;
};

export type RepliesToTweetInvalidInputError = Error & {
  __typename?: "RepliesToTweetInvalidInputError";
  message: Scalars["String"];
  tweetId?: Maybe<Scalars["String"]>;
};

export type CreateTweetResult = Tweet | CreateTweetInvalidInputError;

export type CreateTweetInvalidInputError = Error & {
  __typename?: "CreateTweetInvalidInputError";
  message: Scalars["String"];
  body?: Maybe<Scalars["String"]>;
  conversationId?: Maybe<Scalars["String"]>;
  inReplyToId?: Maybe<Scalars["String"]>;
};

export type DeleteTweetResult =
  | DeleteResourceResponse
  | DeleteTweetInvalidInputError;

export type DeleteResourceResponse = {
  __typename?: "DeleteResourceResponse";
  node?: Maybe<Node>;
  status?: Maybe<Scalars["Boolean"]>;
};

export type DeleteTweetInvalidInputError = Error & {
  __typename?: "DeleteTweetInvalidInputError";
  message: Scalars["String"];
  tweetId?: Maybe<Scalars["String"]>;
};

export type LikeTweetResult =
  | UpdateResourceResponse
  | LikeTweetInvalidInputError;

export type LikeTweetInvalidInputError = Error & {
  __typename?: "LikeTweetInvalidInputError";
  message: Scalars["String"];
  tweetId?: Maybe<Scalars["String"]>;
};

export type SendMessageResult =
  | SendMessageSuccess
  | SendMessageInvalidInputError;

export type SendMessageSuccess = {
  __typename?: "SendMessageSuccess";
  newmessage: MessageEdge;
  conversation: Conversation;
};

export type SendMessageInvalidInputError = Error & {
  __typename?: "SendMessageInvalidInputError";
  message: Scalars["String"];
  text: Scalars["String"];
  conversationId: Scalars["String"];
  senderId: Scalars["ID"];
  receiverId: Scalars["String"];
};

export type MessageUserResult =
  | MessageUserSuccess
  | MessageUserInvalidInputError;

export type MessageUserSuccess = {
  __typename?: "MessageUserSuccess";
  node?: Maybe<Conversation>;
};

export type MessageUserInvalidInputError = Error & {
  __typename?: "MessageUserInvalidInputError";
  message: Scalars["String"];
  userId?: Maybe<Scalars["String"]>;
};

export type ReadConversationResult =
  | UpdateResourceResponse
  | ReadConversationInvalidInputError;

export type ReadConversationInvalidInputError = Error & {
  __typename?: "ReadConversationInvalidInputError";
  message: Scalars["String"];
  messageId?: Maybe<Scalars["String"]>;
  conversationId?: Maybe<Scalars["String"]>;
};

export type LeaveConversationResult =
  | UpdateResourceResponse
  | LeaveConversationInvalidInputError;

export type LeaveConversationInvalidInputError = Error & {
  __typename?: "LeaveConversationInvalidInputError";
  message: Scalars["String"];
  conversationId?: Maybe<Scalars["String"]>;
};

export type SeeMessageResult =
  | UpdateResourceResponse
  | SeeMessageInvalidInputError;

export type SeeMessageInvalidInputError = Error & {
  __typename?: "SeeMessageInvalidInputError";
  message: Scalars["String"];
  messageId?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  _?: Maybe<Scalars["String"]>;
  conversationUpdated?: Maybe<ConversationUpdatedResult>;
};

export type SubscriptionConversationUpdatedArgs = {
  userId: Scalars["String"];
};

export type ConversationUpdatedResult = {
  __typename?: "ConversationUpdatedResult";
  conversation?: Maybe<Conversation>;
  message?: Maybe<Message>;
  sender?: Maybe<User>;
};

export enum Permission {
  OwnsAccount = "ownsAccount",
  OwnsPost = "ownsPost",
}

export type TweetEdge = {
  __typename?: "TweetEdge";
  cursor: Scalars["String"];
  node: Tweet;
};

export type LastSeenMessage = Node & {
  __typename?: "LastSeenMessage";
  id: Scalars["ID"];
  lastSeenMessageId: Scalars["String"];
  userId: Scalars["String"];
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}

export type TweetLikesFieldsFragment = { __typename?: "Tweet" } & Pick<
  Tweet,
  "id" | "isLiked" | "inReplyToUsername" | "likesCount" | "replyCount"
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

export type LeaveConversationMutationVariables = Exact<{
  conversationId: Scalars["String"];
}>;

export type LeaveConversationMutation = { __typename?: "Mutation" } & {
  leaveConversation:
    | ({ __typename: "UpdateResourceResponse" } & Pick<
        UpdateResourceResponse,
        "status"
      > & {
          node?: Maybe<
            | { __typename?: "User" }
            | { __typename?: "Tweet" }
            | ({ __typename?: "Conversation" } & Pick<
                Conversation,
                | "id"
                | "conversationId"
                | "lastReadMessageId"
                | "mostRecentEntryId"
                | "oldestEntryId"
                | "type"
              > & {
                  participants?: Maybe<
                    Array<
                      { __typename?: "Participants" } & Pick<
                        Participants,
                        "userId" | "lastReadMessageId"
                      >
                    >
                  >;
                })
            | { __typename?: "LeftConversationAt" }
            | { __typename?: "LastSeenMessage" }
          >;
        })
    | ({ __typename: "LeaveConversationInvalidInputError" } & Pick<
        LeaveConversationInvalidInputError,
        "message" | "conversationId"
      >);
};

export type MessageUserMutationVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type MessageUserMutation = { __typename?: "Mutation" } & {
  messageUser:
    | ({ __typename: "MessageUserSuccess" } & {
        node?: Maybe<
          { __typename?: "Conversation" } & Pick<
            Conversation,
            | "id"
            | "conversationId"
            | "lastReadMessageId"
            | "mostRecentEntryId"
            | "oldestEntryId"
            | "type"
          > & {
              participants?: Maybe<
                Array<
                  { __typename?: "Participants" } & Pick<
                    Participants,
                    "userId" | "lastReadMessageId"
                  >
                >
              >;
              messages_conversation?: Maybe<
                Array<
                  { __typename?: "Message" } & Pick<
                    Message,
                    "conversationId" | "id"
                  > & {
                      messagedata: { __typename?: "MessageData" } & Pick<
                        MessageData,
                        | "text"
                        | "senderId"
                        | "receiverId"
                        | "conversationId"
                        | "id"
                      >;
                    }
                >
              >;
            }
        >;
      })
    | ({ __typename: "MessageUserInvalidInputError" } & Pick<
        MessageUserInvalidInputError,
        "message" | "userId"
      >);
};

export type ReadConversationMutationVariables = Exact<{
  conversationId: Scalars["String"];
  messageId: Scalars["String"];
}>;

export type ReadConversationMutation = { __typename?: "Mutation" } & {
  readConversation:
    | ({ __typename: "UpdateResourceResponse" } & Pick<
        UpdateResourceResponse,
        "status"
      > & {
          node?: Maybe<
            | { __typename?: "User" }
            | { __typename?: "Tweet" }
            | ({ __typename?: "Conversation" } & Pick<
                Conversation,
                | "id"
                | "conversationId"
                | "lastReadMessageId"
                | "mostRecentEntryId"
                | "oldestEntryId"
                | "type"
              > & {
                  participants?: Maybe<
                    Array<
                      { __typename?: "Participants" } & Pick<
                        Participants,
                        "userId" | "lastReadMessageId"
                      >
                    >
                  >;
                })
            | { __typename?: "LeftConversationAt" }
            | { __typename?: "LastSeenMessage" }
          >;
        })
    | ({ __typename: "ReadConversationInvalidInputError" } & Pick<
        ReadConversationInvalidInputError,
        "message" | "messageId" | "conversationId"
      >);
};

export type SendMessageMutationVariables = Exact<{
  text: Scalars["String"];
  conversationId: Scalars["String"];
  senderId: Scalars["ID"];
  receiverId: Scalars["String"];
}>;

export type SendMessageMutation = { __typename?: "Mutation" } & {
  sendMessage:
    | ({ __typename: "SendMessageSuccess" } & {
        newmessage: { __typename?: "MessageEdge" } & Pick<
          MessageEdge,
          "cursor"
        > & {
            node: { __typename?: "Message" } & Pick<
              Message,
              "id" | "conversationId"
            > & {
                messagedata: { __typename?: "MessageData" } & Pick<
                  MessageData,
                  "text" | "id" | "receiverId" | "conversationId" | "senderId"
                >;
              };
          };
        conversation: { __typename?: "Conversation" } & Pick<
          Conversation,
          | "conversationId"
          | "id"
          | "lastReadMessageId"
          | "mostRecentEntryId"
          | "oldestEntryId"
          | "type"
        > & {
            participants?: Maybe<
              Array<
                { __typename?: "Participants" } & Pick<
                  Participants,
                  "userId" | "lastReadMessageId"
                >
              >
            >;
            messages_conversation?: Maybe<
              Array<
                { __typename?: "Message" } & Pick<
                  Message,
                  "conversationId" | "id"
                > & {
                    messagedata: { __typename?: "MessageData" } & Pick<
                      MessageData,
                      | "text"
                      | "senderId"
                      | "receiverId"
                      | "conversationId"
                      | "id"
                    >;
                  }
              >
            >;
          };
      })
    | ({ __typename: "SendMessageInvalidInputError" } & Pick<
        SendMessageInvalidInputError,
        "message" | "senderId" | "receiverId" | "text" | "conversationId"
      >);
};

export type SeeMessageMutationVariables = Exact<{
  messageId: Scalars["String"];
}>;

export type SeeMessageMutation = { __typename?: "Mutation" } & {
  seeMessage:
    | ({ __typename: "UpdateResourceResponse" } & Pick<
        UpdateResourceResponse,
        "status"
      > & {
          node?: Maybe<
            | { __typename?: "User" }
            | { __typename?: "Tweet" }
            | { __typename?: "Conversation" }
            | { __typename?: "LeftConversationAt" }
            | ({ __typename?: "LastSeenMessage" } & Pick<
                LastSeenMessage,
                "id" | "userId" | "lastSeenMessageId"
              >)
          >;
        })
    | ({ __typename: "SeeMessageInvalidInputError" } & Pick<
        SeeMessageInvalidInputError,
        "message" | "messageId"
      >);
};

export type MessagesQueryVariables = Exact<{
  conversationId: Scalars["String"];
  cursorId?: Maybe<Scalars["String"]>;
  limit: Scalars["Int"];
  leftAtMessageId?: Maybe<Scalars["String"]>;
}>;

export type MessagesQuery = { __typename?: "Query" } & {
  messages:
    | ({ __typename: "MessagesConnection" } & {
        pageInfo: { __typename?: "PageInfo" } & Pick<
          PageInfo,
          "hasPreviousPage" | "hasNextPage" | "startCursor" | "endCursor"
        >;
        conversation: { __typename?: "Conversation" } & Pick<
          Conversation,
          | "id"
          | "conversationId"
          | "lastReadMessageId"
          | "mostRecentEntryId"
          | "oldestEntryId"
          | "type"
        > & {
            messages_conversation?: Maybe<
              Array<
                { __typename?: "Message" } & Pick<
                  Message,
                  "conversationId" | "id"
                > & {
                    messagedata: { __typename?: "MessageData" } & Pick<
                      MessageData,
                      | "text"
                      | "senderId"
                      | "receiverId"
                      | "id"
                      | "conversationId"
                    >;
                  }
              >
            >;
            participants?: Maybe<
              Array<
                { __typename?: "Participants" } & Pick<
                  Participants,
                  "userId" | "lastReadMessageId"
                >
              >
            >;
          };
        edges?: Maybe<
          Array<
            { __typename?: "MessageEdge" } & Pick<MessageEdge, "cursor"> & {
                node: { __typename?: "Message" } & Pick<
                  Message,
                  "conversationId" | "id"
                > & {
                    messagedata: { __typename?: "MessageData" } & Pick<
                      MessageData,
                      | "text"
                      | "senderId"
                      | "receiverId"
                      | "id"
                      | "conversationId"
                    >;
                  };
              }
          >
        >;
      })
    | ({ __typename: "MessagesInvalidInputError" } & Pick<
        MessagesInvalidInputError,
        "message" | "conversationId" | "cursorId" | "limit" | "leftAtMessageId"
      >);
};

export type ConversationUpdatedSubscriptionVariables = Exact<{
  userId: Scalars["String"];
}>;

export type ConversationUpdatedSubscription = {
  __typename?: "Subscription";
} & {
  conversationUpdated?: Maybe<
    { __typename?: "ConversationUpdatedResult" } & {
      conversation?: Maybe<
        { __typename?: "Conversation" } & Pick<
          Conversation,
          | "id"
          | "conversationId"
          | "lastReadMessageId"
          | "mostRecentEntryId"
          | "oldestEntryId"
          | "type"
        > & {
            participants?: Maybe<
              Array<
                { __typename?: "Participants" } & Pick<
                  Participants,
                  "userId" | "lastReadMessageId"
                >
              >
            >;
            messages_conversation?: Maybe<
              Array<
                { __typename?: "Message" } & Pick<
                  Message,
                  "conversationId" | "id"
                > & {
                    messagedata: { __typename?: "MessageData" } & Pick<
                      MessageData,
                      | "text"
                      | "senderId"
                      | "receiverId"
                      | "conversationId"
                      | "id"
                    >;
                  }
              >
            >;
          }
      >;
      message?: Maybe<
        { __typename?: "Message" } & Pick<Message, "id" | "conversationId"> & {
            messagedata: { __typename?: "MessageData" } & Pick<
              MessageData,
              "text" | "receiverId" | "id" | "conversationId" | "senderId"
            >;
          }
      >;
      sender?: Maybe<
        { __typename?: "User" } & Pick<User, "id" | "username" | "avatar">
      >;
    }
  >;
};

export type LeftAtQueryVariables = Exact<{
  userId: Scalars["String"];
  conversationId: Scalars["String"];
}>;

export type LeftAtQuery = { __typename?: "Query" } & {
  leftAt:
    | ({ __typename: "LeftAtSuccess" } & {
        node: { __typename: "LeftConversationAt" } & Pick<
          LeftConversationAt,
          "userId" | "conversationId" | "leftAtMessageId"
        >;
      })
    | ({ __typename: "LeftAtInvalidInputError" } & Pick<
        LeftAtInvalidInputError,
        "message" | "userId" | "conversationId"
      >);
};

export type UserInboxQueryVariables = Exact<{ [key: string]: never }>;

export type UserInboxQuery = { __typename?: "Query" } & {
  userInbox?: Maybe<
    { __typename?: "UserinboxResult" } & Pick<
      UserinboxResult,
      "userId" | "lastSeenMessageId"
    > & {
        conversations?: Maybe<
          Array<
            { __typename?: "Conversation" } & Pick<
              Conversation,
              | "conversationId"
              | "id"
              | "lastReadMessageId"
              | "mostRecentEntryId"
              | "oldestEntryId"
              | "type"
            > & {
                participants?: Maybe<
                  Array<
                    { __typename?: "Participants" } & Pick<
                      Participants,
                      "userId" | "lastReadMessageId"
                    >
                  >
                >;
                messages_conversation?: Maybe<
                  Array<
                    { __typename?: "Message" } & Pick<
                      Message,
                      "conversationId" | "id"
                    > & {
                        messagedata: { __typename?: "MessageData" } & Pick<
                          MessageData,
                          | "text"
                          | "senderId"
                          | "receiverId"
                          | "conversationId"
                          | "id"
                        >;
                      }
                  >
                >;
              }
          >
        >;
        users?: Maybe<
          Array<
            { __typename?: "User" } & Pick<User, "id" | "avatar" | "username">
          >
        >;
      }
  >;
};

export type CreateTweetMutationVariables = Exact<{
  body: Scalars["String"];
  conversationId?: Maybe<Scalars["ID"]>;
  inReplyToId?: Maybe<Scalars["ID"]>;
}>;

export type CreateTweetMutation = { __typename?: "Mutation" } & {
  createTweet?: Maybe<
    | ({ __typename: "Tweet" } & Pick<
        Tweet,
        "id" | "body" | "conversationId" | "inReplyToId"
      > & {
          owner?: Maybe<
            { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "name" | "email"
            > &
              UserAvatarFieldsFragment
          >;
        } & TweetLikesFieldsFragment)
    | ({ __typename: "CreateTweetInvalidInputError" } & Pick<
        CreateTweetInvalidInputError,
        "message" | "conversationId" | "inReplyToId"
      > & { bodyError: CreateTweetInvalidInputError["body"] })
  >;
};

export type DeleteTweetMutationVariables = Exact<{
  tweetId: Scalars["ID"];
}>;

export type DeleteTweetMutation = { __typename?: "Mutation" } & {
  deleteTweet?: Maybe<
    | ({ __typename?: "DeleteResourceResponse" } & Pick<
        DeleteResourceResponse,
        "status"
      >)
    | { __typename?: "DeleteTweetInvalidInputError" }
  >;
};

export type LikeTweetMutationVariables = Exact<{
  tweetId: Scalars["ID"];
}>;

export type LikeTweetMutation = { __typename?: "Mutation" } & {
  likeTweet?: Maybe<
    | ({ __typename?: "UpdateResourceResponse" } & Pick<
        UpdateResourceResponse,
        "status"
      > & {
          node?: Maybe<
            | ({ __typename?: "User" } & Pick<User, "id">)
            | ({ __typename?: "Tweet" } & Pick<Tweet, "id"> &
                TweetLikesFieldsFragment)
            | ({ __typename?: "Conversation" } & Pick<Conversation, "id">)
            | ({ __typename?: "LeftConversationAt" } & Pick<
                LeftConversationAt,
                "id"
              >)
            | ({ __typename?: "LastSeenMessage" } & Pick<LastSeenMessage, "id">)
          >;
        })
    | ({ __typename?: "LikeTweetInvalidInputError" } & Pick<
        LikeTweetInvalidInputError,
        "message" | "tweetId"
      >)
  >;
};

export type RepliesToTweetMutationVariables = Exact<{
  tweetId: Scalars["ID"];
}>;

export type RepliesToTweetMutation = { __typename?: "Mutation" } & {
  repliesToTweet:
    | ({ __typename: "RepliesToTweetSuccess" } & {
        edges?: Maybe<
          Array<
            { __typename?: "Tweet" } & Pick<
              Tweet,
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
              } & TweetLikesFieldsFragment
          >
        >;
      })
    | ({ __typename: "RepliesToTweetInvalidInputError" } & Pick<
        RepliesToTweetInvalidInputError,
        "message" | "tweetId"
      >);
};

export type ConversationQueryVariables = Exact<{
  conversationId: Scalars["ID"];
  tweetId: Scalars["ID"];
}>;

export type ConversationQuery = { __typename?: "Query" } & {
  conversation:
    | ({ __typename: "ConversationSuccess" } & {
        edges?: Maybe<
          Array<
            { __typename?: "Tweet" } & Pick<
              Tweet,
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
              } & TweetLikesFieldsFragment
          >
        >;
      })
    | ({ __typename: "ConversationInvalidInputError" } & Pick<
        ConversationInvalidInputError,
        "message" | "tweetId" | "conversationId"
      >);
};

export type FeedQueryVariables = Exact<{
  after?: Maybe<Scalars["String"]>;
}>;

export type FeedQuery = { __typename?: "Query" } & {
  feed: { __typename?: "TweetConnection" } & Pick<TweetConnection, "count"> & {
      pageInfo: { __typename?: "PageInfo" } & Pick<
        PageInfo,
        "hasPreviousPage" | "hasNextPage" | "startCursor" | "endCursor"
      >;
      edges?: Maybe<
        Array<
          { __typename?: "Tweet" } & Pick<
            Tweet,
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
            } & TweetLikesFieldsFragment
        >
      >;
    };
};

export type RepliesQueryVariables = Exact<{
  tweetId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
}>;

export type RepliesQuery = { __typename?: "Query" } & {
  replies:
    | ({ __typename?: "TweetConnection" } & Pick<TweetConnection, "count"> & {
          pageInfo: { __typename?: "PageInfo" } & Pick<
            PageInfo,
            "hasPreviousPage" | "hasNextPage" | "startCursor" | "endCursor"
          >;
          edges?: Maybe<
            Array<
              { __typename?: "Tweet" } & Pick<
                Tweet,
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
                } & TweetLikesFieldsFragment
            >
          >;
        })
    | ({ __typename?: "TweetsInvalidInputError" } & Pick<
        TweetsInvalidInputError,
        "message" | "after" | "tweetId"
      >);
};

export type TweetQueryVariables = Exact<{
  tweetId?: Maybe<Scalars["ID"]>;
}>;

export type TweetQuery = { __typename?: "Query" } & {
  tweet:
    | ({ __typename?: "TweetSuccess" } & {
        node: { __typename?: "Tweet" } & Pick<
          Tweet,
          "id" | "body" | "conversationId" | "inReplyToId"
        > & {
            owner?: Maybe<
              { __typename?: "User" } & Pick<
                User,
                "id" | "username" | "name" | "email"
              > &
                UserAvatarFieldsFragment
            >;
          } & TweetLikesFieldsFragment;
      })
    | ({ __typename?: "TweetInvalidInputError" } & Pick<
        TweetInvalidInputError,
        "message" | "tweetId"
      >);
};

export type UserLikedTweetsQueryVariables = Exact<{
  userId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
}>;

export type UserLikedTweetsQuery = { __typename?: "Query" } & {
  userLikedTweets:
    | ({ __typename: "TweetConnection" } & Pick<TweetConnection, "count"> & {
          pageInfo: { __typename?: "PageInfo" } & Pick<
            PageInfo,
            "hasPreviousPage" | "hasNextPage" | "startCursor" | "endCursor"
          >;
          edges?: Maybe<
            Array<
              { __typename?: "Tweet" } & Pick<
                Tweet,
                "id" | "body" | "conversationId" | "inReplyToId"
              > & {
                  owner?: Maybe<
                    { __typename?: "User" } & Pick<
                      User,
                      "id" | "username" | "name" | "email"
                    > &
                      UserAvatarFieldsFragment
                  >;
                } & TweetLikesFieldsFragment
            >
          >;
        })
    | ({ __typename: "TweetsInvalidInputError" } & Pick<
        TweetsInvalidInputError,
        "message" | "after" | "userId"
      >);
};

export type UserTweetsQueryVariables = Exact<{
  userId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
}>;

export type UserTweetsQuery = { __typename?: "Query" } & {
  userTweets:
    | ({ __typename: "TweetConnection" } & Pick<TweetConnection, "count"> & {
          pageInfo: { __typename?: "PageInfo" } & Pick<
            PageInfo,
            "hasPreviousPage" | "hasNextPage" | "startCursor" | "endCursor"
          >;
          edges?: Maybe<
            Array<
              { __typename?: "Tweet" } & Pick<
                Tweet,
                "id" | "body" | "conversationId" | "inReplyToId"
              > & {
                  owner?: Maybe<
                    { __typename?: "User" } & Pick<
                      User,
                      "id" | "username" | "name" | "email"
                    > &
                      UserAvatarFieldsFragment
                  >;
                } & TweetLikesFieldsFragment
            >
          >;
        })
    | ({ __typename: "TweetsInvalidInputError" } & Pick<
        TweetsInvalidInputError,
        "message" | "after" | "userId"
      >);
};

export type UserTweetsAndRepliesQueryVariables = Exact<{
  userId: Scalars["ID"];
  after?: Maybe<Scalars["ID"]>;
}>;

export type UserTweetsAndRepliesQuery = { __typename?: "Query" } & {
  userTweetsAndReplies:
    | ({ __typename: "TweetConnection" } & Pick<TweetConnection, "count"> & {
          pageInfo: { __typename?: "PageInfo" } & Pick<
            PageInfo,
            "hasPreviousPage" | "hasNextPage" | "startCursor" | "endCursor"
          >;
          edges?: Maybe<
            Array<
              { __typename?: "Tweet" } & Pick<
                Tweet,
                "id" | "body" | "conversationId" | "inReplyToId"
              > & {
                  owner?: Maybe<
                    { __typename?: "User" } & Pick<
                      User,
                      "id" | "username" | "name" | "email"
                    > &
                      UserAvatarFieldsFragment
                  >;
                } & TweetLikesFieldsFragment
            >
          >;
        })
    | ({ __typename: "TweetsInvalidInputError" } & Pick<
        TweetsInvalidInputError,
        "message" | "after" | "userId"
      >);
};

export type FollowUserMutationVariables = Exact<{
  userId: Scalars["ID"];
}>;

export type FollowUserMutation = { __typename?: "Mutation" } & {
  followUser?: Maybe<
    | ({ __typename?: "UpdateResourceResponse" } & {
        node?: Maybe<
          | ({ __typename?: "User" } & Pick<User, "id"> &
              UserFollowerFieldsFragment &
              UserAvatarFieldsFragment)
          | { __typename?: "Tweet" }
          | { __typename?: "Conversation" }
          | { __typename?: "LeftConversationAt" }
          | { __typename?: "LastSeenMessage" }
        >;
      })
    | ({ __typename?: "FollowUserInvalidInputError" } & Pick<
        FollowUserInvalidInputError,
        "message" | "userId"
      >)
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
          | { __typename?: "Tweet" }
          | { __typename?: "Conversation" }
          | { __typename?: "LeftConversationAt" }
          | { __typename?: "LastSeenMessage" }
        >;
      }
  >;
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

export type RandomUsersQueryVariables = Exact<{
  userId: Scalars["String"];
}>;

export type RandomUsersQuery = { __typename?: "Query" } & {
  randomUsers?: Maybe<
    Array<
      { __typename?: "User" } & Pick<User, "id" | "username" | "name"> &
        UserAvatarFieldsFragment &
        UserFollowerFieldsFragment
    >
  >;
};

export type GetUserByNameQueryVariables = Exact<{
  username: Scalars["String"];
}>;

export type GetUserByNameQuery = { __typename?: "Query" } & {
  userByName:
    | ({ __typename: "UserByNameSuccess" } & {
        node: { __typename?: "User" } & Pick<
          User,
          "id" | "email" | "username" | "name" | "bio" | "website"
        > &
          UserFollowerFieldsFragment &
          UserAvatarFieldsFragment;
      })
    | ({ __typename: "UserByNameInvalidInputError" } & Pick<
        UserByNameInvalidInputError,
        "message" | "username"
      >);
};

export const TweetLikesFieldsFragmentDoc = gql`
  fragment tweetLikesFields on Tweet {
    id
    isLiked @client
    inReplyToUsername @client
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
export const LeaveConversationDocument = gql`
  mutation leaveConversation($conversationId: String!) {
    leaveConversation(conversationId: $conversationId) {
      __typename
      ... on UpdateResourceResponse {
        status
        node {
          ... on Conversation {
            id
            conversationId
            lastReadMessageId
            mostRecentEntryId
            oldestEntryId
            type
            participants {
              userId
              lastReadMessageId
            }
          }
        }
      }
      ... on LeaveConversationInvalidInputError {
        message
        conversationId
        __typename
      }
    }
  }
`;
export type LeaveConversationMutationFn = Apollo.MutationFunction<
  LeaveConversationMutation,
  LeaveConversationMutationVariables
>;

/**
 * __useLeaveConversationMutation__
 *
 * To run a mutation, you first call `useLeaveConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveConversationMutation, { data, loading, error }] = useLeaveConversationMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useLeaveConversationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LeaveConversationMutation,
    LeaveConversationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    LeaveConversationMutation,
    LeaveConversationMutationVariables
  >(LeaveConversationDocument, options);
}
export type LeaveConversationMutationHookResult = ReturnType<
  typeof useLeaveConversationMutation
>;
export type LeaveConversationMutationResult = Apollo.MutationResult<LeaveConversationMutation>;
export type LeaveConversationMutationOptions = Apollo.BaseMutationOptions<
  LeaveConversationMutation,
  LeaveConversationMutationVariables
>;
export const MessageUserDocument = gql`
  mutation messageUser($userId: ID!) {
    messageUser(userId: $userId) {
      __typename
      ... on MessageUserSuccess {
        node {
          ... on Conversation {
            id
            conversationId
            lastReadMessageId
            mostRecentEntryId
            oldestEntryId
            participants {
              userId
              lastReadMessageId
            }
            messages_conversation {
              conversationId
              id
              messagedata {
                text
                senderId
                receiverId
                conversationId
                id
              }
            }
            type
          }
        }
      }
      ... on MessageUserInvalidInputError {
        message
        userId
        __typename
      }
    }
  }
`;
export type MessageUserMutationFn = Apollo.MutationFunction<
  MessageUserMutation,
  MessageUserMutationVariables
>;

/**
 * __useMessageUserMutation__
 *
 * To run a mutation, you first call `useMessageUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMessageUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [messageUserMutation, { data, loading, error }] = useMessageUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useMessageUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MessageUserMutation,
    MessageUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MessageUserMutation, MessageUserMutationVariables>(
    MessageUserDocument,
    options
  );
}
export type MessageUserMutationHookResult = ReturnType<
  typeof useMessageUserMutation
>;
export type MessageUserMutationResult = Apollo.MutationResult<MessageUserMutation>;
export type MessageUserMutationOptions = Apollo.BaseMutationOptions<
  MessageUserMutation,
  MessageUserMutationVariables
>;
export const ReadConversationDocument = gql`
  mutation readConversation($conversationId: String!, $messageId: String!) {
    readConversation(conversationId: $conversationId, messageId: $messageId) {
      __typename
      ... on UpdateResourceResponse {
        status
        node {
          ... on Conversation {
            id
            conversationId
            lastReadMessageId
            mostRecentEntryId
            oldestEntryId
            type
            participants {
              userId
              lastReadMessageId
            }
          }
        }
      }
      ... on ReadConversationInvalidInputError {
        message
        messageId
        conversationId
        __typename
      }
    }
  }
`;
export type ReadConversationMutationFn = Apollo.MutationFunction<
  ReadConversationMutation,
  ReadConversationMutationVariables
>;

/**
 * __useReadConversationMutation__
 *
 * To run a mutation, you first call `useReadConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readConversationMutation, { data, loading, error }] = useReadConversationMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useReadConversationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReadConversationMutation,
    ReadConversationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ReadConversationMutation,
    ReadConversationMutationVariables
  >(ReadConversationDocument, options);
}
export type ReadConversationMutationHookResult = ReturnType<
  typeof useReadConversationMutation
>;
export type ReadConversationMutationResult = Apollo.MutationResult<ReadConversationMutation>;
export type ReadConversationMutationOptions = Apollo.BaseMutationOptions<
  ReadConversationMutation,
  ReadConversationMutationVariables
>;
export const SendMessageDocument = gql`
  mutation sendMessage(
    $text: String!
    $conversationId: String!
    $senderId: ID!
    $receiverId: String!
  ) {
    sendMessage(
      text: $text
      conversationId: $conversationId
      senderId: $senderId
      receiverId: $receiverId
    ) {
      __typename
      ... on SendMessageSuccess {
        newmessage {
          cursor
          node {
            id
            conversationId
            messagedata {
              text
              id
              receiverId
              conversationId
              senderId
            }
          }
        }
        conversation {
          conversationId
          id
          lastReadMessageId
          mostRecentEntryId
          oldestEntryId
          participants {
            userId
            lastReadMessageId
          }
          messages_conversation {
            conversationId
            id
            messagedata {
              text
              senderId
              receiverId
              conversationId
              id
            }
          }
          type
        }
      }
      ... on SendMessageInvalidInputError {
        message
        senderId
        receiverId
        text
        conversationId
      }
    }
  }
`;
export type SendMessageMutationFn = Apollo.MutationFunction<
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
 *      receiverId: // value for 'receiverId'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(
    SendMessageDocument,
    options
  );
}
export type SendMessageMutationHookResult = ReturnType<
  typeof useSendMessageMutation
>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>;
export const SeeMessageDocument = gql`
  mutation seeMessage($messageId: String!) {
    seeMessage(messageId: $messageId) {
      __typename
      ... on UpdateResourceResponse {
        status
        node {
          ... on LastSeenMessage {
            id
            userId
            lastSeenMessageId
          }
        }
      }
      ... on SeeMessageInvalidInputError {
        message
        messageId
      }
    }
  }
`;
export type SeeMessageMutationFn = Apollo.MutationFunction<
  SeeMessageMutation,
  SeeMessageMutationVariables
>;

/**
 * __useSeeMessageMutation__
 *
 * To run a mutation, you first call `useSeeMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSeeMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [seeMessageMutation, { data, loading, error }] = useSeeMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useSeeMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SeeMessageMutation,
    SeeMessageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SeeMessageMutation, SeeMessageMutationVariables>(
    SeeMessageDocument,
    options
  );
}
export type SeeMessageMutationHookResult = ReturnType<
  typeof useSeeMessageMutation
>;
export type SeeMessageMutationResult = Apollo.MutationResult<SeeMessageMutation>;
export type SeeMessageMutationOptions = Apollo.BaseMutationOptions<
  SeeMessageMutation,
  SeeMessageMutationVariables
>;
export const MessagesDocument = gql`
  query messages(
    $conversationId: String!
    $cursorId: String
    $limit: Int!
    $leftAtMessageId: String
  ) {
    messages(
      conversationId: $conversationId
      cursorId: $cursorId
      limit: $limit
      leftAtMessageId: $leftAtMessageId
    ) {
      __typename
      ... on MessagesConnection {
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        conversation {
          id
          conversationId
          lastReadMessageId
          mostRecentEntryId
          oldestEntryId
          type
          messages_conversation {
            conversationId
            id
            messagedata {
              text
              senderId
              receiverId
              id
              conversationId
            }
          }
          participants {
            userId
            lastReadMessageId
          }
        }
        edges {
          cursor
          node {
            conversationId
            id
            messagedata {
              text
              senderId
              receiverId
              id
              conversationId
            }
          }
        }
      }
      ... on MessagesInvalidInputError {
        message
        conversationId
        cursorId
        limit
        leftAtMessageId
      }
    }
  }
`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      cursorId: // value for 'cursorId'
 *      limit: // value for 'limit'
 *      leftAtMessageId: // value for 'leftAtMessageId'
 *   },
 * });
 */
export function useMessagesQuery(
  baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(
    MessagesDocument,
    options
  );
}
export function useMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MessagesQuery,
    MessagesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(
    MessagesDocument,
    options
  );
}
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<
  typeof useMessagesLazyQuery
>;
export type MessagesQueryResult = Apollo.QueryResult<
  MessagesQuery,
  MessagesQueryVariables
>;
export const ConversationUpdatedDocument = gql`
  subscription conversationUpdated($userId: String!) {
    conversationUpdated(userId: $userId) {
      conversation {
        id
        conversationId
        lastReadMessageId
        mostRecentEntryId
        oldestEntryId
        type
        participants {
          userId
          lastReadMessageId
        }
        messages_conversation {
          conversationId
          id
          messagedata {
            text
            senderId
            receiverId
            conversationId
            id
          }
        }
      }
      message {
        id
        conversationId
        messagedata {
          text
          receiverId
          id
          conversationId
          senderId
        }
      }
      sender {
        id
        username
        avatar
      }
    }
  }
`;

/**
 * __useConversationUpdatedSubscription__
 *
 * To run a query within a React component, call `useConversationUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useConversationUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationUpdatedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useConversationUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    ConversationUpdatedSubscription,
    ConversationUpdatedSubscriptionVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    ConversationUpdatedSubscription,
    ConversationUpdatedSubscriptionVariables
  >(ConversationUpdatedDocument, options);
}
export type ConversationUpdatedSubscriptionHookResult = ReturnType<
  typeof useConversationUpdatedSubscription
>;
export type ConversationUpdatedSubscriptionResult = Apollo.SubscriptionResult<ConversationUpdatedSubscription>;
export const LeftAtDocument = gql`
  query leftAt($userId: String!, $conversationId: String!) {
    leftAt(userId: $userId, conversationId: $conversationId) {
      __typename
      ... on LeftAtSuccess {
        node {
          ... on LeftConversationAt {
            userId
            conversationId
            leftAtMessageId
            __typename
          }
        }
      }
      ... on LeftAtInvalidInputError {
        __typename
        message
        userId
        conversationId
      }
    }
  }
`;

/**
 * __useLeftAtQuery__
 *
 * To run a query within a React component, call `useLeftAtQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeftAtQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeftAtQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useLeftAtQuery(
  baseOptions: Apollo.QueryHookOptions<LeftAtQuery, LeftAtQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LeftAtQuery, LeftAtQueryVariables>(
    LeftAtDocument,
    options
  );
}
export function useLeftAtLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LeftAtQuery, LeftAtQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LeftAtQuery, LeftAtQueryVariables>(
    LeftAtDocument,
    options
  );
}
export type LeftAtQueryHookResult = ReturnType<typeof useLeftAtQuery>;
export type LeftAtLazyQueryHookResult = ReturnType<typeof useLeftAtLazyQuery>;
export type LeftAtQueryResult = Apollo.QueryResult<
  LeftAtQuery,
  LeftAtQueryVariables
>;
export const UserInboxDocument = gql`
  query userInbox {
    userInbox {
      userId
      lastSeenMessageId
      conversations {
        conversationId
        id
        lastReadMessageId
        mostRecentEntryId
        oldestEntryId
        participants {
          userId
          lastReadMessageId
        }
        messages_conversation {
          conversationId
          id
          messagedata {
            text
            senderId
            receiverId
            conversationId
            id
          }
        }
        type
      }
      users {
        id
        avatar
        username
      }
    }
  }
`;

/**
 * __useUserInboxQuery__
 *
 * To run a query within a React component, call `useUserInboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserInboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserInboxQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserInboxQuery(
  baseOptions?: Apollo.QueryHookOptions<UserInboxQuery, UserInboxQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserInboxQuery, UserInboxQueryVariables>(
    UserInboxDocument,
    options
  );
}
export function useUserInboxLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserInboxQuery,
    UserInboxQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserInboxQuery, UserInboxQueryVariables>(
    UserInboxDocument,
    options
  );
}
export type UserInboxQueryHookResult = ReturnType<typeof useUserInboxQuery>;
export type UserInboxLazyQueryHookResult = ReturnType<
  typeof useUserInboxLazyQuery
>;
export type UserInboxQueryResult = Apollo.QueryResult<
  UserInboxQuery,
  UserInboxQueryVariables
>;
export const CreateTweetDocument = gql`
  mutation createTweet($body: String!, $conversationId: ID, $inReplyToId: ID) {
    createTweet(
      body: $body
      inReplyToId: $inReplyToId
      conversationId: $conversationId
    ) {
      __typename
      ... on Tweet {
        id
        body
        conversationId
        inReplyToId
        ...tweetLikesFields
        owner {
          id
          username
          name
          email
          ...userAvatarFields
        }
      }
      ... on CreateTweetInvalidInputError {
        message
        bodyError: body
        conversationId
        inReplyToId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;
export type CreateTweetMutationFn = Apollo.MutationFunction<
  CreateTweetMutation,
  CreateTweetMutationVariables
>;

/**
 * __useCreateTweetMutation__
 *
 * To run a mutation, you first call `useCreateTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTweetMutation, { data, loading, error }] = useCreateTweetMutation({
 *   variables: {
 *      body: // value for 'body'
 *      conversationId: // value for 'conversationId'
 *      inReplyToId: // value for 'inReplyToId'
 *   },
 * });
 */
export function useCreateTweetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTweetMutation,
    CreateTweetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateTweetMutation, CreateTweetMutationVariables>(
    CreateTweetDocument,
    options
  );
}
export type CreateTweetMutationHookResult = ReturnType<
  typeof useCreateTweetMutation
>;
export type CreateTweetMutationResult = Apollo.MutationResult<CreateTweetMutation>;
export type CreateTweetMutationOptions = Apollo.BaseMutationOptions<
  CreateTweetMutation,
  CreateTweetMutationVariables
>;
export const DeleteTweetDocument = gql`
  mutation deleteTweet($tweetId: ID!) {
    deleteTweet(tweetId: $tweetId) {
      ... on DeleteResourceResponse {
        status
      }
    }
  }
`;
export type DeleteTweetMutationFn = Apollo.MutationFunction<
  DeleteTweetMutation,
  DeleteTweetMutationVariables
>;

/**
 * __useDeleteTweetMutation__
 *
 * To run a mutation, you first call `useDeleteTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTweetMutation, { data, loading, error }] = useDeleteTweetMutation({
 *   variables: {
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useDeleteTweetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTweetMutation,
    DeleteTweetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteTweetMutation, DeleteTweetMutationVariables>(
    DeleteTweetDocument,
    options
  );
}
export type DeleteTweetMutationHookResult = ReturnType<
  typeof useDeleteTweetMutation
>;
export type DeleteTweetMutationResult = Apollo.MutationResult<DeleteTweetMutation>;
export type DeleteTweetMutationOptions = Apollo.BaseMutationOptions<
  DeleteTweetMutation,
  DeleteTweetMutationVariables
>;
export const LikeTweetDocument = gql`
  mutation likeTweet($tweetId: ID!) {
    likeTweet(tweetId: $tweetId) {
      ... on UpdateResourceResponse {
        node {
          id
          ... on Tweet {
            ...tweetLikesFields
          }
        }
        status
      }
      ... on LikeTweetInvalidInputError {
        message
        tweetId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
`;
export type LikeTweetMutationFn = Apollo.MutationFunction<
  LikeTweetMutation,
  LikeTweetMutationVariables
>;

/**
 * __useLikeTweetMutation__
 *
 * To run a mutation, you first call `useLikeTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeTweetMutation, { data, loading, error }] = useLikeTweetMutation({
 *   variables: {
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useLikeTweetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LikeTweetMutation,
    LikeTweetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LikeTweetMutation, LikeTweetMutationVariables>(
    LikeTweetDocument,
    options
  );
}
export type LikeTweetMutationHookResult = ReturnType<
  typeof useLikeTweetMutation
>;
export type LikeTweetMutationResult = Apollo.MutationResult<LikeTweetMutation>;
export type LikeTweetMutationOptions = Apollo.BaseMutationOptions<
  LikeTweetMutation,
  LikeTweetMutationVariables
>;
export const RepliesToTweetDocument = gql`
  mutation repliesToTweet($tweetId: ID!) {
    repliesToTweet(tweetId: $tweetId) {
      __typename
      ... on RepliesToTweetSuccess {
        edges {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
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
      ... on RepliesToTweetInvalidInputError {
        message
        tweetId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
  ${UserFollowerFieldsFragmentDoc}
`;
export type RepliesToTweetMutationFn = Apollo.MutationFunction<
  RepliesToTweetMutation,
  RepliesToTweetMutationVariables
>;

/**
 * __useRepliesToTweetMutation__
 *
 * To run a mutation, you first call `useRepliesToTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRepliesToTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [repliesToTweetMutation, { data, loading, error }] = useRepliesToTweetMutation({
 *   variables: {
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useRepliesToTweetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RepliesToTweetMutation,
    RepliesToTweetMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RepliesToTweetMutation,
    RepliesToTweetMutationVariables
  >(RepliesToTweetDocument, options);
}
export type RepliesToTweetMutationHookResult = ReturnType<
  typeof useRepliesToTweetMutation
>;
export type RepliesToTweetMutationResult = Apollo.MutationResult<RepliesToTweetMutation>;
export type RepliesToTweetMutationOptions = Apollo.BaseMutationOptions<
  RepliesToTweetMutation,
  RepliesToTweetMutationVariables
>;
export const ConversationDocument = gql`
  query conversation($conversationId: ID!, $tweetId: ID!) {
    conversation(conversationId: $conversationId, tweetId: $tweetId) {
      __typename
      ... on ConversationSuccess {
        edges {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
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
      ... on ConversationInvalidInputError {
        message
        tweetId
        conversationId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
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
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useConversationQuery(
  baseOptions: Apollo.QueryHookOptions<
    ConversationQuery,
    ConversationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ConversationQuery, ConversationQueryVariables>(
    ConversationDocument,
    options
  );
}
export function useConversationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ConversationQuery,
    ConversationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ConversationQuery, ConversationQueryVariables>(
    ConversationDocument,
    options
  );
}
export type ConversationQueryHookResult = ReturnType<
  typeof useConversationQuery
>;
export type ConversationLazyQueryHookResult = ReturnType<
  typeof useConversationLazyQuery
>;
export type ConversationQueryResult = Apollo.QueryResult<
  ConversationQuery,
  ConversationQueryVariables
>;
export const FeedDocument = gql`
  query feed($after: String) {
    feed(after: $after) {
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      count
      edges {
        id
        body
        conversationId
        inReplyToId
        ...tweetLikesFields
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
  }
  ${TweetLikesFieldsFragmentDoc}
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
 *      after: // value for 'after'
 *   },
 * });
 */
export function useFeedQuery(
  baseOptions?: Apollo.QueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FeedQuery, FeedQueryVariables>(FeedDocument, options);
}
export function useFeedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FeedQuery, FeedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FeedQuery, FeedQueryVariables>(
    FeedDocument,
    options
  );
}
export type FeedQueryHookResult = ReturnType<typeof useFeedQuery>;
export type FeedLazyQueryHookResult = ReturnType<typeof useFeedLazyQuery>;
export type FeedQueryResult = Apollo.QueryResult<FeedQuery, FeedQueryVariables>;
export const RepliesDocument = gql`
  query replies($tweetId: ID!, $after: ID) {
    replies(tweetId: $tweetId, after: $after) {
      ... on TweetConnection {
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        count
        edges {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
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
      ... on TweetsInvalidInputError {
        message
        after
        tweetId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
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
 *      tweetId: // value for 'tweetId'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useRepliesQuery(
  baseOptions: Apollo.QueryHookOptions<RepliesQuery, RepliesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RepliesQuery, RepliesQueryVariables>(
    RepliesDocument,
    options
  );
}
export function useRepliesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RepliesQuery, RepliesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RepliesQuery, RepliesQueryVariables>(
    RepliesDocument,
    options
  );
}
export type RepliesQueryHookResult = ReturnType<typeof useRepliesQuery>;
export type RepliesLazyQueryHookResult = ReturnType<typeof useRepliesLazyQuery>;
export type RepliesQueryResult = Apollo.QueryResult<
  RepliesQuery,
  RepliesQueryVariables
>;
export const TweetDocument = gql`
  query tweet($tweetId: ID) {
    tweet(tweetId: $tweetId) {
      ... on TweetSuccess {
        node {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
          owner {
            id
            username
            name
            email
            ...userAvatarFields
          }
        }
      }
      ... on TweetInvalidInputError {
        message
        tweetId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useTweetQuery__
 *
 * To run a query within a React component, call `useTweetQuery` and pass it any options that fit your needs.
 * When your component renders, `useTweetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTweetQuery({
 *   variables: {
 *      tweetId: // value for 'tweetId'
 *   },
 * });
 */
export function useTweetQuery(
  baseOptions?: Apollo.QueryHookOptions<TweetQuery, TweetQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TweetQuery, TweetQueryVariables>(
    TweetDocument,
    options
  );
}
export function useTweetLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TweetQuery, TweetQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TweetQuery, TweetQueryVariables>(
    TweetDocument,
    options
  );
}
export type TweetQueryHookResult = ReturnType<typeof useTweetQuery>;
export type TweetLazyQueryHookResult = ReturnType<typeof useTweetLazyQuery>;
export type TweetQueryResult = Apollo.QueryResult<
  TweetQuery,
  TweetQueryVariables
>;
export const UserLikedTweetsDocument = gql`
  query userLikedTweets($userId: ID!, $after: ID) {
    userLikedTweets(userId: $userId, after: $after) {
      __typename
      ... on TweetConnection {
        count
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
          owner {
            id
            username
            name
            email
            ...userAvatarFields
          }
        }
      }
      ... on TweetsInvalidInputError {
        message
        after
        userId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useUserLikedTweetsQuery__
 *
 * To run a query within a React component, call `useUserLikedTweetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserLikedTweetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserLikedTweetsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useUserLikedTweetsQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserLikedTweetsQuery,
    UserLikedTweetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserLikedTweetsQuery, UserLikedTweetsQueryVariables>(
    UserLikedTweetsDocument,
    options
  );
}
export function useUserLikedTweetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserLikedTweetsQuery,
    UserLikedTweetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserLikedTweetsQuery,
    UserLikedTweetsQueryVariables
  >(UserLikedTweetsDocument, options);
}
export type UserLikedTweetsQueryHookResult = ReturnType<
  typeof useUserLikedTweetsQuery
>;
export type UserLikedTweetsLazyQueryHookResult = ReturnType<
  typeof useUserLikedTweetsLazyQuery
>;
export type UserLikedTweetsQueryResult = Apollo.QueryResult<
  UserLikedTweetsQuery,
  UserLikedTweetsQueryVariables
>;
export const UserTweetsDocument = gql`
  query userTweets($userId: ID!, $after: ID) {
    userTweets(userId: $userId, after: $after) {
      __typename
      ... on TweetConnection {
        count
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
          owner {
            id
            username
            name
            email
            ...userAvatarFields
          }
        }
      }
      ... on TweetsInvalidInputError {
        message
        after
        userId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useUserTweetsQuery__
 *
 * To run a query within a React component, call `useUserTweetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTweetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTweetsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useUserTweetsQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserTweetsQuery,
    UserTweetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserTweetsQuery, UserTweetsQueryVariables>(
    UserTweetsDocument,
    options
  );
}
export function useUserTweetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserTweetsQuery,
    UserTweetsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserTweetsQuery, UserTweetsQueryVariables>(
    UserTweetsDocument,
    options
  );
}
export type UserTweetsQueryHookResult = ReturnType<typeof useUserTweetsQuery>;
export type UserTweetsLazyQueryHookResult = ReturnType<
  typeof useUserTweetsLazyQuery
>;
export type UserTweetsQueryResult = Apollo.QueryResult<
  UserTweetsQuery,
  UserTweetsQueryVariables
>;
export const UserTweetsAndRepliesDocument = gql`
  query userTweetsAndReplies($userId: ID!, $after: ID) {
    userTweetsAndReplies(userId: $userId, after: $after) {
      __typename
      ... on TweetConnection {
        count
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          id
          body
          conversationId
          inReplyToId
          ...tweetLikesFields
          owner {
            id
            username
            name
            email
            ...userAvatarFields
          }
        }
      }
      ... on TweetsInvalidInputError {
        message
        after
        userId
      }
    }
  }
  ${TweetLikesFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useUserTweetsAndRepliesQuery__
 *
 * To run a query within a React component, call `useUserTweetsAndRepliesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTweetsAndRepliesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTweetsAndRepliesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useUserTweetsAndRepliesQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserTweetsAndRepliesQuery,
    UserTweetsAndRepliesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    UserTweetsAndRepliesQuery,
    UserTweetsAndRepliesQueryVariables
  >(UserTweetsAndRepliesDocument, options);
}
export function useUserTweetsAndRepliesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserTweetsAndRepliesQuery,
    UserTweetsAndRepliesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserTweetsAndRepliesQuery,
    UserTweetsAndRepliesQueryVariables
  >(UserTweetsAndRepliesDocument, options);
}
export type UserTweetsAndRepliesQueryHookResult = ReturnType<
  typeof useUserTweetsAndRepliesQuery
>;
export type UserTweetsAndRepliesLazyQueryHookResult = ReturnType<
  typeof useUserTweetsAndRepliesLazyQuery
>;
export type UserTweetsAndRepliesQueryResult = Apollo.QueryResult<
  UserTweetsAndRepliesQuery,
  UserTweetsAndRepliesQueryVariables
>;
export const FollowUserDocument = gql`
  mutation followUser($userId: ID!) {
    followUser(userId: $userId) {
      ... on UpdateResourceResponse {
        node {
          ... on User {
            id
            ...userFollowerFields
            ...userAvatarFields
          }
        }
      }
      ... on FollowUserInvalidInputError {
        message
        userId
      }
    }
  }
  ${UserFollowerFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;
export type FollowUserMutationFn = Apollo.MutationFunction<
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
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useFollowUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FollowUserMutation,
    FollowUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(
    FollowUserDocument,
    options
  );
}
export type FollowUserMutationHookResult = ReturnType<
  typeof useFollowUserMutation
>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<
  FollowUserMutation,
  FollowUserMutationVariables
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
export type LoginMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
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
export type RegisterMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
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
export type UpdateUserMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options
  );
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
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
export type UploadAvatarMutationFn = Apollo.MutationFunction<
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
  baseOptions?: Apollo.MutationHookOptions<
    UploadAvatarMutation,
    UploadAvatarMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UploadAvatarMutation,
    UploadAvatarMutationVariables
  >(UploadAvatarDocument, options);
}
export type UploadAvatarMutationHookResult = ReturnType<
  typeof useUploadAvatarMutation
>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<
  UploadAvatarMutation,
  UploadAvatarMutationVariables
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
  baseOptions?: Apollo.QueryHookOptions<AuthUserQuery, AuthUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AuthUserQuery, AuthUserQueryVariables>(
    AuthUserDocument,
    options
  );
}
export function useAuthUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AuthUserQuery,
    AuthUserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AuthUserQuery, AuthUserQueryVariables>(
    AuthUserDocument,
    options
  );
}
export type AuthUserQueryHookResult = ReturnType<typeof useAuthUserQuery>;
export type AuthUserLazyQueryHookResult = ReturnType<
  typeof useAuthUserLazyQuery
>;
export type AuthUserQueryResult = Apollo.QueryResult<
  AuthUserQuery,
  AuthUserQueryVariables
>;
export const RandomUsersDocument = gql`
  query randomUsers($userId: String!) {
    randomUsers(userId: $userId) {
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
 * __useRandomUsersQuery__
 *
 * To run a query within a React component, call `useRandomUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useRandomUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRandomUsersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRandomUsersQuery(
  baseOptions: Apollo.QueryHookOptions<
    RandomUsersQuery,
    RandomUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RandomUsersQuery, RandomUsersQueryVariables>(
    RandomUsersDocument,
    options
  );
}
export function useRandomUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    RandomUsersQuery,
    RandomUsersQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RandomUsersQuery, RandomUsersQueryVariables>(
    RandomUsersDocument,
    options
  );
}
export type RandomUsersQueryHookResult = ReturnType<typeof useRandomUsersQuery>;
export type RandomUsersLazyQueryHookResult = ReturnType<
  typeof useRandomUsersLazyQuery
>;
export type RandomUsersQueryResult = Apollo.QueryResult<
  RandomUsersQuery,
  RandomUsersQueryVariables
>;
export const GetUserByNameDocument = gql`
  query getUserByName($username: String!) {
    userByName(username: $username) {
      __typename
      ... on UserByNameSuccess {
        node {
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
      ... on UserByNameInvalidInputError {
        message
        username
        __typename
      }
    }
  }
  ${UserFollowerFieldsFragmentDoc}
  ${UserAvatarFieldsFragmentDoc}
`;

/**
 * __useGetUserByNameQuery__
 *
 * To run a query within a React component, call `useGetUserByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByNameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserByNameQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserByNameQuery,
    GetUserByNameQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserByNameQuery, GetUserByNameQueryVariables>(
    GetUserByNameDocument,
    options
  );
}
export function useGetUserByNameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserByNameQuery,
    GetUserByNameQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserByNameQuery, GetUserByNameQueryVariables>(
    GetUserByNameDocument,
    options
  );
}
export type GetUserByNameQueryHookResult = ReturnType<
  typeof useGetUserByNameQuery
>;
export type GetUserByNameLazyQueryHookResult = ReturnType<
  typeof useGetUserByNameLazyQuery
>;
export type GetUserByNameQueryResult = Apollo.QueryResult<
  GetUserByNameQuery,
  GetUserByNameQueryVariables
>;
