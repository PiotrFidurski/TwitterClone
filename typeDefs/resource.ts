import { gql } from "apollo-server-core";

export default gql`
  type UpdateResourceResponse {
    node: Node
    status: Boolean
  }
  type DeleteResourceResponse {
    node: Node
    status: Boolean
  }
`;
