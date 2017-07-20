var express = require('express');
var router = express.Router();
var filmapi = require('../controllers/filmapi');

/* GET film page. Using romote data, not own mongodb data */
router.get('/:filmid', function(req, res, next) {
    filmapi.add(req.params.filmid, function(film){
        if(film == null){
            res.send('not found');
        }
        else{
            res.render('film', {
                id: film.id,
                title: film.title,
                title_original: film.title_original,
                poster: film.poster,
                year: film.year,
                country: film.country,
                genre: film.genre,
                director: film.director,
                actors: film.actors,
                description: film.description,
                rating_imdb: film.rating_imdb,
                rating_kp: film.rating_kp
            });
        }
    });
});

module.exports = router;
