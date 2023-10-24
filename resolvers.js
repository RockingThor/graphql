import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const User = mongoose.model("User");

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
    user: (_, { _id }) => {
      return users.find((user) => user._id == _id);
    },
    quote: (_, { by }) => {
      return quotes.filter((quote) => quote.by === by);
    },
  },
  User: {
    quotes: (ur) => quotes.filter((quote) => quote.by === ur._id),
  },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already exist with this email");
      }
      const hashedPassword = await bcrypt.hash(userNew.password, 12);
      const newUser = await new User({
        ...userNew,
        password: hashedPassword,
      });
      return await newUser.save();
    },
    signinUser: async (_, { userData }) => {
      const user = await User.findOne({ email: userData.email });
      if (user) {
        const passMatch = await bcrypt.compare(
          userData.password,
          user.password
        );
        if (passMatch) {
          const token = Jwt.sign({ userId: user._id }, process.env.JWT_KEY);
          return { token };
        } else {
          throw new Error("Email or Password is invalid");
        }
      } else {
        throw new Error("No user found with the specified email");
      }
    },
  },
};

export default resolvers;
