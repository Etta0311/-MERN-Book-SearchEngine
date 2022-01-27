// make a search to google books api
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};