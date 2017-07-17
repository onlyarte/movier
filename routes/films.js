var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request-json');
var client = request.createClient('http://getmovie.cc/');

/* GET users listing. */
router.get('/:filmid', function(req, res, next) {
    var path = 'api/kinopoisk.json?id=' + req.params.filmid + '&token=037313259a17be837be3bd04a51bf678';
    client.get(path, function(err, kpres, body) {
        var filmObj = JSON.parse(kpres.body);
        res.render('film', { title: filmObj.name_en,
            year: filmObj.year,
            country: filmObj.country,
            genre: filmObj.genre,
            description: filmObj.description});
    });
});

module.exports = router;
