const express = require('express');
const router = express.Router();
const channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    channelapi.findById(req.params.id, function(error, channel){
        if(error)
            return next(error);

            if(req.session.channel){
                channelapi.findById(req.session.channel, function(error, authchannel){
                    if(error)
                        next(error);
                    authchannel._password = null;
                    res.render('channel', { channel: channel, authch: authchannel});
                });
            } else {
                res.render('channel', { channel : channel });
            }
    });
});

module.exports = router;
