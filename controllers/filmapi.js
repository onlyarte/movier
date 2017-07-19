var Film = require('../models/film');

var findById = function(id, callback){
    Film.findOne({_id: id}, function(error, film) {
        if(!error){
            callback(film);
        }
    });
}

var findByTitle = function(title, callback){
    Film.find({ $or: [{_title: title}, {_title_original : title}]}, function(error, films{
        if(!error){
            callback(films);
        }
    }));
}

var add = function(film, callback){
    new Film({_
        _id: film.id,
        _title: film.title,
        _title_original: film.title_original,
        _poster: film.poster,
        _year: film.year,
        _country: film.country,
        _genre: film.genre,
        _director: film.director,
        _actors: film.actors
    }).save();
}

module.exports.findById = findById;
module.exports.findByTitle = findByTitle;
module.exports.add = add;
