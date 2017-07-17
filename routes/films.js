var express = require('express');
var router = express.Router();
var request = require('request-json');
var client = request.createClient('http://getmovie.cc/');

/* GET film page. */
router.get('/:filmid', function(req, res, next) {
    var path = 'api/kinopoisk.json?id=' + req.params.filmid + '&token=037313259a17be837be3bd04a51bf678';
    client.get(path, function(err, kpres, body) {
        if(err){
            return res.render('error', {error: err});
        }

        var filmObj = JSON.parse(kpres.body);
        res.render('film', { title_original: filmObj.name_en,
            title_rus: filmObj.name_ru,
            year: filmObj.year,
            country: filmObj.country,
            genre: filmObj.genre,
            director: filmObj.creators.director,
            description: filmObj.description,
            poster: filmObj.poster_film_big,
            rating_kp: filmObj.rating.kp_rating,
            rating_imdb: filmObj.rating.imdb});
    });
});

module.exports = router;
