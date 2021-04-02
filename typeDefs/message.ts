import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    userInbox: [Conversation!] @auth
    conversationMessages(
      conversationId: String!
      cursorId: String
      limit: Int!
    ): ConversationMessagesResult @auth
  }
  extend type Mutation {
    updateLastSeenMessage(
      messageId: String!
      conversationId: String!
    ): Conversation @auth
    readConversation(conversationId: String!, messageId: String!): Conversation
      @auth
    messageUser(userId: ID!): Conversation @auth
    acceptInvitation(conversationId: String!): Conversation @auth
    sendMessage(
      text: String!
      conversationId: String!
      senderId: ID!
      receiverId: String
    ): Message! @auth
  }
  extend type Subscription {
    conversationUpdated(userId: String!): ConversationUpdatedResult @auth
  }
  type ConversationMessagesResult {
    conversation: Conversation!
    hasNextPage: Boolean!
    messages: [Message!]
  }
  type ConversationUpdatedResult {
    conversation: Conversation
    message: Message
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
    lastSeenMessageId: String
  }

  type Conversation {
    id: ID!
    conversationId: String!
    lastReadMessageId: String
    mostRecentEntryId: String
    oldestEntryId: String
    type: String
    messages_conversation: [Message!]
    user: User!
    participants: [Participants!]
    acceptedInvitation: [String!]
  }
`;
