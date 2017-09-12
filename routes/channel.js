const express = require('express');
const router = express.Router();
const channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    channelapi.findById(req.params.id, function(error, channel){
        if(error)
            return next(error);

        //res.render('channel', channel);
        res.send(channel);
    });
});

module.exports = router;
