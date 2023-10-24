import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    greet: String
    users: [User]
    user(_id: ID!): User
    quotes: [Quote]
    quote(by: String!): [Quote]
  }
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    quotes: [Quote]
  }
  type Quote {
    name: String
    by: String
  }
  type Token {
    token: String
  }
  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userData: UserSigninInput!): Token
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input UserSigninInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
