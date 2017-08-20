var express = require('express');
var router = express.Router();
var filmapi = require('../controllers/filmapi');

router.get('/:id', function(req, res, next) {
    filmapi.getFromKP(req.params.id, function(error, film){
        if(error)
            return next(error);

        //res.render('film', film);
        res.send(film);
    });
});

module.exports = router;
