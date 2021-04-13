import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    userInbox: UserinboxResult @auth
    conversationMessages(
      conversationId: String!
      cursorId: String
      limit: Int!
      leftAtMessageId: String
    ): ConversationMessagesResult @auth
    leftAt(userId: String!, conversationId: String!): LeftConversationAt @auth
  }
  extend type Mutation {
    updateLastSeenMessage(messageId: String!): UnreadMessage @auth
    readConversation(conversationId: String!, messageId: String!): Conversation
      @auth
    messageUser(userId: ID!): Conversation @auth
    sendMessage(
      text: String!
      conversationId: String!
      senderId: ID!
      receiverId: String
    ): SendMessageResult! @auth
    leaveConversation(conversationId: String!): Conversation @auth
  }
  extend type Subscription {
    conversationUpdated(userId: String!): ConversationUpdatedResult @auth
  }
  type UserinboxResult {
    conversations: [Conversation!]
    users: [User!]
    lastSeenMessageId: String
    userId: String
  }
  type UnreadMessage {
    lastSeenMessageId: String
    userId: String
  }
  type LeftConversationAt {
    userId: String
    conversationId: String
    leftAtMessageId: String
  }
  type ConversationMessagesResult {
    conversation: Conversation!
    hasNextPage: Boolean!
    messages: [Message!]
    id: ID!
  }
  type ConversationUpdatedResult {
    conversation: Conversation
    message: Message
    receiver: User
  }
  type SendMessageResult {
    message: Message!
    conversation: Conversation
  }
  type Message {
    id: ID!
    conversationId: String!
    messagedata: MessageData!
  }
  type MessageData {
    id: ID!
    text: String!
    conversationId: String!
    senderId: String!
    receiverId: String!
  }

  type Participants {
    userId: String!
    lastReadMessageId: String
  }

  type Conversation {
    id: ID!
    conversationId: String!
    lastReadMessageId: String
    mostRecentEntryId: String
    oldestEntryId: String
    type: String
    messages_conversation: [Message!]
    user: User
    participants: [Participants!]
  }
`;
