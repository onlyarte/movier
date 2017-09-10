var express = require('express');
var router = express.Router();
var filmapi = require('../controllers/filmapi');
var listapi = require('../controllers/listapi');
var channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    filmapi.getFromKP(req.params.id, function(error, film){
        if(error)
            return next(error);

        //get channel from db
        var channel;
        if(req.session.channel){
            channelapi.findById(req.session.channel, function(error, dbchannel){
                if(!error)
                    channel = dbchannel;
            });
        }

        //data obj
        var info = {
            film: film,
            channel: channel
        }

        res.render('film', info);
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
