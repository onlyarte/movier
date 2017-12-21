const request       = require('request-json');
const client        = request.createClient('http://www.omdbapi.com/');

const get = function getFilmById(id, callback){
    client.get(
        `?i=${id}&plot=full&apikey=6d2a1ba3`, 
        (error, res, body) => {
            const film = format (body);

            if (!film && callback) return callback(new Error('Film not found!'), null);

            if (callback) return callback(null, film);
            return film;
        },
    );
};

const search = function findFilmByTitle(title, callback) {
    const query = encodeURI(title);
    client.get(
        `http://www.omdbapi.com/?s=${query}&apikey=6d2a1ba3&page=1`, 
        (error, res, body) => {
            const films = body.Search && Array.from(body.Search, format);

            if (!films) return callback(null, null);

            return callback(null, films);
        },
    );
}

const format = function fromImdbFormatToOwn(film) {
    return {
        title: film.Title, 
        description: film.Plot, 
        year: film.Year, 
        genre: film.Genre,
        rating: film.Ratings && film.Ratings[0].Value,
        director: film.Director, 
        writers: film.Writer, 
        stars: film.Actors,
        id: film.imdbID,
        poster: film.Poster.replace('@._V1_SX300', '@._V1_SX700'), // change quality
    };
}

module.exports.get      = get;
module.exports.search   = search;
