var express = require('express');
var router = express.Router();
var filmapi = require('../controllers/filmapi');
var listapi = require('../controllers/listapi');

router.get('/:id', function(req, res, next) {
    filmapi.getFromKP(req.params.id, function(error, film){
        if(error)
            return next(error);

        res.render('film', film);
        //res.send(film);
    });
});

//add film to list
router.post('/:id/tolist/:listid', function(req, res, next) {
    listapi.addToList(req.params.listid, req.params.id, function(error, list){
        if(error)
            return next(error);

        res.send(list);
    });
});

//remove film from list
router.post('/:id/fromlist/:listid', function(req, res, next){
    listapi.removeFromList(req.params.listid, req.params.id, function(error, list){
        if(error)
            return next(error);

        res.send(list);
    });
});

module.exports = router;
