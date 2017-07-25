var request = require('request-json');
var client = request.createClient('http://getmovie.cc/');
var https = require('https');
var fs = require('fs');

var Film = require('../models/film');

var findById = function(id, callback){
    Film.findOne({_id: id}, function(error, film) {
        if(!err && film != null){
            callback(film);
        }
        else{
            callback(null);
        }
    });
};

var findByTitle = function(title, callback){
    Film.find({ $or: [{_title: title}, {_title_original : title}]}, function(error, films) {
        if(!error){
            callback(films);
        }
    });
};

var add = function(filmId, callback){
    Film.findById(filmId, function(film){
        if(film == null){
            getFromKP(filmId, function(filmKP){
                if(typeof callback === 'function' && filmKP == null)
                    callback(null);
                else{
                    var directors = [];
                    function addDirector(director, index, arr){
                        directors.push(director.name_person_ru);
                    }
                    filmKP.director.forEach(addDirector);

                    var actors = [];
                    function addActor(actor, index, arr){
                        actors.push(actor.name_person_ru);
                    }
                    filmKP.actors.forEach(addActor);

                    var new_film = new Film({
                        _id: filmKP.id,
                        _title: filmKP.title,
                        _title_original: filmKP.title_original,
                        _poster: filmKP.poster,
                        _year: filmKP.year,
                        _country: filmKP.country,
                        _genre: filmKP.genre,
                        _director: directors,
                        _actors: directors,
                        _description: filmKP.description
                    });
                    new_film.save();
                    if(typeof callback === 'function')
                        callback(new_film);
                }
            });
        }
    });
};

var getFromKP = function(filmId, callback){
    console.log('film ' + filmId + ' requested from kp');
    var path = 'api/kinopoisk.json?id=' + filmId + '&token=037313259a17be837be3bd04a51bf678';
    client.get(path, function(err, kpres, body) {
        if(err){
            callback(null);
        }
        else{
            var filmObj = JSON.parse(kpres.body);
            console.log(filmObj);
            getPoster(filmObj.poster_film_big, function(poster_url){
                var film = {
                    id: filmObj.id,
                    title: filmObj.name_ru,
                    title_original: filmObj.name_en,
                    poster: poster_url,
                    year: filmObj.year,
                    country: filmObj.country,
                    genre: filmObj.genre,
                    director: filmObj.creators.director || [],
                    actors: filmObj.creators.actor || [],
                    description: filmObj.description,
                    rating_kp: filmObj.rating.kp_rating,
                    rating_imdb: filmObj.rating.imdb
                };

                callback(film);
            });
        }
    });
};

function getPoster(original_url, callback){
    var file_name = original_url.replace(/[^\w\s]/gi, '') + '.jpg';
    var path = './public/images/temp/' + file_name;
    var copy_url = '/images/temp/' + file_name;
    if(!fs.existsSync(path)){
        var file = fs.createWriteStream(path);
        file.on('open', function(fd) {
            https.get(original_url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close();
                    callback(copy_url);
                });
            }).on('error', function(err) {
                fs.unlink(path);
                callback('#not_found');
            });
        });
    }
    else{
        callback(copy_url);
    }
}

module.exports.findById = findById;
module.exports.findByTitle = findByTitle;
module.exports.add = add;
module.exports.getFromKP = getFromKP;
