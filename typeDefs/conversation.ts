import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    userInbox: UserinboxResult @auth
    leftAt(userId: String!, conversationId: String!): LeftAtResult! @auth
  }
  extend type Mutation {
    messageUser(userId: ID!): MessageUserResult! @auth
    readConversation(
      conversationId: String!
      messageId: String!
    ): ReadConversationResult! @auth
    leaveConversation(conversationId: String!): LeaveConversationResult! @auth
    seeMessage(messageId: String!): SeeMessageResult! @auth
  }
  type Conversation implements Node {
    id: ID!
    conversationId: String
    lastReadMessageId: String
    mostRecentEntryId: String
    oldestEntryId: String
    type: String
    messages_conversation: [Message!]
    participants: [Participants!]
  }
  type LeftConversationAt implements Node {
    userId: String
    id: ID!
    conversationId: String
    leftAtMessageId: String
  }
  type LastSeenMessage implements Node {
    id: ID!
    lastSeenMessageId: String!
    userId: String!
  }
  type UserinboxResult {
    conversations: [Conversation!]
    users: [User!]
    lastSeenMessageId: String
    userId: String
  }
  type Participants {
    userId: String!
    lastReadMessageId: String
  }

  union MessageUserResult = MessageUserSuccess | MessageUserInvalidInputError
  type MessageUserSuccess {
    node: Conversation
  }
  type MessageUserInvalidInputError implements Error {
    message: String!
    userId: String
  }
  union LeftAtResult = LeftAtSuccess | LeftAtInvalidInputError
  type LeftAtSuccess {
    node: LeftConversationAt!
  }
  type LeftAtInvalidInputError implements Error {
    message: String!
    userId: String
    conversationId: String
  }
  union ReadConversationResult =
      UpdateResourceResponse
    | ReadConversationInvalidInputError
  type ReadConversationInvalidInputError implements Error {
    message: String!
    messageId: String
    conversationId: String
  }
  union LeaveConversationResult =
      UpdateResourceResponse
    | LeaveConversationInvalidInputError
  type LeaveConversationInvalidInputError implements Error {
    message: String!
    conversationId: String
  }
  union SeeMessageResult = UpdateResourceResponse | SeeMessageInvalidInputError
  type SeeMessageInvalidInputError implements Error {
    message: String!
    messageId: String
  }
`;
