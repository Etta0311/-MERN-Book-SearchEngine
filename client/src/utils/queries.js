import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        authors
        title
        bookId
        description
        image
        link
      }
    }
  }
`;