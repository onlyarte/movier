var express = require('express');
var router = express.Router();
var request = require('request-json');
var filmapi = require('../controllers/filmapi');
var client = request.createClient('http://getmovie.cc/');
var https = require('https');
var fs = require('fs');

/* GET film page. Using romote data, not own mongodb data */
router.get('/:filmid', function(req, res, next) {
    var path = 'api/kinopoisk.json?id=' + req.params.filmid + '&token=037313259a17be837be3bd04a51bf678';
    client.get(path, function(err, kpres, body) {
        if(err){
            return res.render('error', {error: err});
        }

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

        res.render('film', {
            id: filmObj.id,
            title_original: filmObj.name_en,
            title_rus: filmObj.name_ru,
            year: filmObj.year,
            country: filmObj.country,
            genre: filmObj.genre,
            director: filmObj.creators.director || [],
            description: filmObj.description,
            poster: poster_user_path,
            rating_kp: filmObj.rating.kp_rating,
            rating_imdb: filmObj.rating.imdb});
    });
});

module.exports = router;
