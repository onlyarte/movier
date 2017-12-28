const request = require('request-json');

const client = request.createClient('http://www.omdbapi.com/');

const cast = function readFilm(film) {
  return {
    title: film.Title,
    description: film.Plot,
    year: film.Year,
    genre: film.Genre,
    rating: film.Ratings && film.Ratings[0] && film.Ratings[0].Value,
    director: film.Director,
    writers: film.Writer,
    stars: film.Actors,
    id: film.imdbID,
    poster: film.Poster && film.Poster.replace('@._V1_SX300', '@._V1_SX700'), // change quality
  };
};

const get = function getFilmById(id) {
  return new Promise((resolve, reject) => {
    client.get(
      `?i=${id}&plot=full&apikey=6d2a1ba3`,
      (error, res, body) => {
        if (error) reject(error);
        resolve(cast(body));
      },
    );
  });
};

const search = function findFilmByTitle(title) {
  return new Promise((resolve, reject) => {
    client.get(
      `http://www.omdbapi.com/?s=${encodeURI(title)}&apikey=6d2a1ba3&page=1`,
      (error, res, body) => {
        if (error) reject(error);
        if (!body.Search) reject(new Error('Search not available'));

        resolve(Array.from(body.Search, cast));
      },
    );
  });
};

module.exports.get = get;
module.exports.search = search;
