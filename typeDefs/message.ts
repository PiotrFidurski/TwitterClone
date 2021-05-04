import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    messages(
      conversationId: String!
      cursorId: String
      limit: Int!
      leftAtMessageId: String
    ): MessagesResult! @auth
  }
  extend type Mutation {
    sendMessage(
      text: String!
      conversationId: String!
      senderId: ID!
      receiverId: String
    ): SendMessageResult! @auth
  }
  extend type Subscription {
    conversationUpdated(userId: String!): ConversationUpdatedResult @auth
  }
  type MessagesConnection {
    conversation: Conversation!
    edges: [MessageEdge!]
    pageInfo: PageInfo!
  }
  type MessageEdge {
    cursor: String!
    node: Message!
  }
  type ConversationUpdatedResult {
    conversation: Conversation
    message: Message
    sender: User
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

  union MessagesResult = MessagesConnection | MessagesInvalidInputError
  type MessagesInvalidInputError implements Error {
    message: String!
    conversationId: String
    cursorId: String
    limit: Int
    leftAtMessageId: String
  }
  union SendMessageResult = SendMessageSuccess | SendMessageInvalidInputError
  type SendMessageSuccess {
    newmessage: MessageEdge!
    conversation: Conversation!
  }
  type SendMessageInvalidInputError implements Error {
    message: String!
    text: String!
    conversationId: String!
    senderId: ID!
    receiverId: String!
  }
`;
