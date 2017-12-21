const express   = require('express');
const router    = express.Router();

const channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    channelapi.get(req.params.id, (error, channel) => {
        if (error) return next(error);
        if (!channel) return next(new Error('Channel not found'));
        
        if (!req.session.channel) {
            return res.render('channel', { channel });
        }
        
        channelapi.get(req.session.channel, (error, authchannel) => {
            if (error) return next(error);
            if (!authchannel) return next(new Error('Please, log in again'));

            const state = {
                home: `/channel/${authchannel.id}`,
                owner: channel.id === authchannel.id ? true : false,
            }

            return res.render('channel', { channel, state });
        });
    });
});

module.exports = router;
