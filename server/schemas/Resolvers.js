const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const savedData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("books");
        return savedData;
      }
      throw new AuthenticationError("Please login to continue.");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found.");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect Input. Please check & try again.");
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        const updatebook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true }
        );
        return updatebook;
      }

      throw new AuthenticationError("Please login to continue.");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const remove = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return remove;
      }
      throw new AuthenticationError("Please login to continue.");
    },
  },
};

module.exports = resolvers;
