import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schemaGql.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Jwt from "jsonwebtoken";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to the db");
});

mongoose.connection.on("error", (err) => {
  console.log("DB connection error", err);
});

import "./models/Quotes.js";
import "./models/User.js";
import resolvers from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = Jwt.verify(authorization, process.env.JWT_KEY);
      return { userId };
    }
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`Server is listening on ${url}`);
});
