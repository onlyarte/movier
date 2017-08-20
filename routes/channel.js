var express = require('express');
var router = express.Router();
var channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    channelapi.findById(req.params.id, function(error, channel){
        if(error)
            return next(error);

        //res.render('channel', channel);
        res.send(channel);
    });
});

module.exports = router;
