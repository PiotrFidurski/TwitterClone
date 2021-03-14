const { gql } = require("apollo-server-express");

export default gql`
  enum Permission {
    ownsAccount
    ownsPost
  }
  directive @auth(requires: [Permission]) on FIELD | FIELD_DEFINITION
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;
