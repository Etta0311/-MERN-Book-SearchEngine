const { AuthenticationError } = require("apollo-server-errors");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).select("-__password");
      }
      throw new AuthenticationError("LOGIN required.");
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
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { books }, context) => {
      if (context.user) {
        const savebk = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: {
              savedBooks: books,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return savebk;
      }
      throw new AuthenticationError("LOGIN required!");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const removebk = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );

        return removebk;
      }
      throw new AuthenticationError("LOGIN required!");
    },
  },
};

module.exports = resolvers;
