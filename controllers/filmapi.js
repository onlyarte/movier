var Film = require('../models/film');

exports.show = function(req, res){
    Film.findOne({id: req.params.id}, function(error, film) {
        res.send(film);
    });
}

exports.showAll = function(req, res){
    Film.find(function(err, films) {
        res.send(films);
    });
}

exports.post = function(req, res) {
    new Film({id: req.body.id, title: req.body.title, title_original: req.body.title_original,
        year: req.body.year, country: req.body.country, genre: req.body.genre,
        director: req.body.director, actors: req.body.actors, kp: req.body.kp, fb: 0}).save();
}
