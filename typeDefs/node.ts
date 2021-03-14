import { gql } from "apollo-server-core";

export default gql`
  interface Error {
    message: String!
  }
  interface Node {
    id: ID!
  }
  extend type Query {
    node(id: ID): Node
  }
`;
