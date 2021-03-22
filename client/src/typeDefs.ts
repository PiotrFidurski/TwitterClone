import { gql } from "@apollo/client";

const typeDefs = gql`
  extend type User {
    isFollowed: Boolean
    isMessaged: Boolean
  }
  extend type Post {
    isLiked: Boolean
  }
`;

export default typeDefs;
