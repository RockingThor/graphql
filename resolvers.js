import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";

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
  Mutation: {
    createUserDummy: (_, { userNew }) => {
      const id = randomBytes(5).toString("hex");
      users.push({
        id,
        ...userNew,
      });
      return users.find((user) => user.id === id);
    },
  },
};

export default resolvers;
