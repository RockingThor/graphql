import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    greet: String
    users: [User]
    user(id: ID!): User
    quotes: [Quote]
    quote(by: String!): [Quote]
  }
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    quotes: [Quote]
  }
  type Quote {
    name: String
    by: String
  }
  type Mutation {
    createUserDummy(userNew: UserInput): User
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
`;

export default typeDefs;
