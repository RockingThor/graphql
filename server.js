import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { quotes, users } from "./fakedb.js";

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
`;
const resolvers = {
  Query: {
    greet: () => {
      return "Hello World";
    },
    users: () => {
      return users;
    },
    quotes: () => {
      return quotes;
    },
    user: (_, { id }) => {
      return users.find((user) => user.id == id);
    },
    quote: (_, { by }) => {
      return quotes.filter((quote) => quote.by === by);
    },
  },
  User: {
    quotes: (ur) => quotes.filter((quote) => quote.by === ur.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`Server is listening on ${url}`);
});
