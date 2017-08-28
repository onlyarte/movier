var request = require('request-json');
var client = request.createClient('http://getmovie.cc/');
var https = require('https');
var fs = require('fs');

var Film = require('../models/film');

var findById = function(id, callback){
    Film.findOne({_id: id}, function(error, film) {
        if(error)
            return callback(error, null);
        if(!film)
            return callback(new Error('Film not found'), null);

        getPoster(film._poster, function(poster_url){
            film._poster = poster_url;
            callback(null, film);
        });
    });
};

var findByTitle = function(title, callback){
    Film.find({ $or: [{_title: title}, {_title_original : title}]}, function(error, films) {
        if(error)
            return callback(error, null);

        for(var film in films){
            getPoster(film._poster, function(poster_url){
                film._poster = poster_url;
            });
        }
        callback(null, films);
    });
};

var add = function(filmId, callback){
    findById(filmId, function(error, film){
        if(!error)
            return callback(film);

        getFromKP(filmId, function(error, filmKP){
            if(error)
                return callback(error, null);

            var new_film = new Film({
                _id: filmKP.id,
                _title: filmKP.title,
                _title_original: filmKP.title_original,
                _poster: filmKP.poster_orig,
                _year: filmKP.year,
                _country: filmKP.country,
                _genre: filmKP.genre,
                _directors: filmKP.directors,
                _writers: filmKP.writers,
                _actors: filmKP.actors,
                _description: filmKP.description
            });
            new_film.save();

            return callback(null, new_film);
        });
    });
};

var getFromKP = function(filmId, callback){
    var path = 'api/kinopoisk.json?id=' + filmId + '&token=037313259a17be837be3bd04a51bf678';
    client.get(path, function(error, kpres, body) {
        if(error)
            return callback(error, null);

        var filmObj = JSON.parse(kpres.body);

        if(!filmObj.name_ru && !filmObj.name_en)
            return callback(new Error('Film not found'), null);

        getPoster(filmObj.poster_film_big, function(poster_url){
            function personToString(input){
                var people = [];
                function addPerson(person, index, arr){
                    people.push(person.name_person_ru);
                }
                input.forEach(addPerson);
                return people;
            }

            var film = {
                id: filmObj.id,
                title: filmObj.name_ru,
                title_original: filmObj.name_en,
                poster: poster_url,
                poster_orig: filmObj.poster_film_big,
                year: filmObj.year,
                country: filmObj.country,
                genre: filmObj.genre,
                directors: [],
                writers: [],
                actors: [],
                description: filmObj.description,
                rating_kp: filmObj.rating.kp_rating,
                rating_imdb: filmObj.rating.imdb
            };

            if(filmObj.creators){
                film.directors = personToString(filmObj.creators.director);
                film.writers = personToString(filmObj.creators.writer);
                film.actors = personToString(filmObj.creators.actor);
            }

            callback(null, film);
        });
    });
};

var getPoster = function getPoster(original_url, callback){
    if(!original_url)
        return callback('#not_found');

    var file_name = original_url.replace(/[^\w\s]/gi, '') + '.jpg';
    var path = './public/images/temp/' + file_name;
    var copy_url = '/images/temp/' + file_name;

    if(fs.existsSync(path))
        return callback(copy_url);

    var file = fs.createWriteStream(path);
    file.on('open', function(fd) {
        https.get(original_url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close();
                callback(copy_url);
            });
        }).on('error', function(error) {
            fs.unlink(path);
            callback('#not_found');
        });
    });
}

module.exports.findById = findById;
module.exports.findByTitle = findByTitle;
module.exports.add = add;
module.exports.getFromKP = getFromKP;
module.exports.getPoster = getPoster;
