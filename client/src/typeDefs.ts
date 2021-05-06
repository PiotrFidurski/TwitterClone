import { gql } from "@apollo/client";

const typeDefs = gql`
  extend type User {
    isFollowed: Boolean
  }
  extend type Tweet {
    isLiked: Boolean
    inReplyToUsername: String
  }
`;

export default typeDefs;
