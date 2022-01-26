const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    me: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  input BookInput {
    bookId : ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  } 

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;