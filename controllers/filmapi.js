const request       = require('request-json');
const client        = request.createClient('https://theimdbapi.org/');

const get = function getFilmById(id, callback){
    client.get(
        `api/movie?movie_id=${id}`, 
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
        'api/find/movie?title=${query}', 
        (error, res, body) => {
            const films = Array.from(body, format);

            if (!films) return callback(null, null);

            return callback(null, films);
        },
    );
}

const format = function fromImdbFormatToOwn({
        imdb_id, 
        title, 
        description, 
        year, 
        genre, 
        poster, // object containing large and thumb
        rating, 
        director, 
        writers, 
        stars,
    }) {
    
    if (!title) return null;

    return {
        title, 
        description, 
        year, 
        genre,
        rating, 
        director, 
        writers, 
        stars,
        id: imdb_id,
        poster: poster.large,
    };
}

module.exports.get      = get;
module.exports.search   = search;
