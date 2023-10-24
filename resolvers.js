import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

const resolvers = {
  Query: {
    users: async () => {
      return await User.find({});
    },
    quotes: async () => {
      return await Quote.find({}).populate("by", "_id firstName lastName");
    },
    user: async (_, { _id }) => {
      return await User.findOne({ _id });
    },
    quote: async (_, { by }) => {
      return await Quote.findOne({ by });
    },
  },
  User: {
    quotes: async (ur) => await Quote.find({ by: ur._id }),
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
    createQuote: async (_, { name }, { userId }) => {
      if (userId) {
        const quote = new Quote({
          name,
          by: userId,
        });
        return await quote.save();
      } else {
        throw new Error("User must be logged in");
      }
    },
  },
};

export default resolvers;
