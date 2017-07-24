var request = require('request-json');
var client = request.createClient('http://getmovie.cc/');
var https = require('https');
var fs = require('fs');

var Film = require('../models/film');

var findById = function(id, callback){
    Film.findOne({_id: id}, function(error, film) {
        if(!error){
            callback(film);
        }
        else{
            callback(null);
        }
    });
}

var findByTitle = function(title, callback){
    Film.find({ $or: [{_title: title}, {_title_original : title}]}, function(error, films) {
        if(!error){
            callback(films);
        }
    });
}

var add = function(filmId, callback){
    Film.findById(filmId, function(film){
        if(film == null){
            console.log('film ' + filmId + ' not found');
            getFromKP(filmId, function(filmKP){
                if(typeof callback === 'function' && filmKP == null)
                    callback(null);
                else{
                    var new_film = new Film({
                        _id: filmKP.id,
                        _title: filmKP.title,
                        _title_original: filmKP.title_original,
                        _poster: filmKP.poster,
                        _year: filmKP.year,
                        _country: filmKP.country,
                        _genre: filmKP.genre,
                        _director: filmKP.director,
                        _actors: filmKP.actors,
                        _description: filmKP.description
                    });
                    new_film.save();
                    console.log("new film");
                    console.log(JSON.stringify(new_film));
                    if(typeof callback === 'function')
                        callback(new_film);
                }
            });
        }
    });
}

var getFromKP = function(filmId, callback){
    console.log('film ' + filmId + ' requested from kp');
    var path = 'api/kinopoisk.json?id=' + filmId + '&token=037313259a17be837be3bd04a51bf678';
    client.get(path, function(err, kpres, body) {
        if(err){
            callback(null);
        }
        else{
            var filmObj = JSON.parse(kpres.body);

            // download poster if absent
            var poster_file_path = './public/images/temp/' + filmObj.poster_film_big.replace(/[^\w\s]/gi, '') + '.jpg';
            if(!fs.existsSync(poster_file_path)){
                var file = fs.createWriteStream(poster_file_path);
                file.on('open', function(fd) {
                    https.get(filmObj.poster_film_big, function(response) {
                        response.pipe(file);
                        file.on('finish', function() {
                            file.close();
                        });
                    }).on('error', function(err) {
                        fs.unlink(poster_file_path);
                    });
                });
            }
            var poster_user_path = '/images/temp/' + filmObj.poster_film_big.replace(/[^\w\s]/gi, '') + '.jpg';
            //var poster_user_path = 'http://www.impawards.com/intl/france/2015/posters/love_xlg.jpg';

            var film = {
                id: filmObj.id,
                title: filmObj.name_ru,
                title_original: filmObj.name_en,
                poster: poster_user_path,
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
        }
    });
}

module.exports.findById = findById;
module.exports.findByTitle = findByTitle;
module.exports.add = add;
module.exports.getFromKP = getFromKP;
