import { gql } from "apollo-server-core";

export default gql`
  extend type Query {
    directconversation(conversationId: ID!): Conversation! @auth
    conversationMessages(conversationId: String!): [Message!] @auth
    userConversations: [Conversation!] @auth
  }
  extend type Mutation {
    messageUser(userId: ID!): Conversation @auth
    acceptInvitation(conversationId: String!): Conversation @auth
    addPeopleToConversation(conversationId: ID, userIds: [ID!]!): Conversation!
      @auth
    createConversation(userIds: [ID!]!): Conversation! @auth
    sendMessage(
      text: String!
      conversationId: String!
      senderId: ID!
      receiverId: String
    ): Message! @auth
  }
  extend type Subscription {
    messageSent(conversationId: String!): Message
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
  type Conversation {
    id: ID!
    conversationId: String!
    members: [User!]
    type: String
    acceptedInvitation: [String!]
    # type could either be group chat 3 or more users, or oneonone chat
    # if type === oneonone cant add more people if type ===group_dm can add more members
  }
  type Member {
    userId: String!
  }
`;
