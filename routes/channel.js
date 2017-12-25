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
        
        channelapi.get(req.session.channel, (error, userchannel) => {
            if (error) return next(error);
            if (!userchannel) return next(new Error('Please, log in again'));

            const state = {
                home: `/channel/${userchannel.id}`,
                owner: channel.id === userchannel.id ? true : false,
                following: channel.id === userchannel.id && userchannel.following,
                isFollowed: userchannel.following.filter(elem => elem.id === channel.id).length > 0,
            }

            return res.render('channel', { channel, state });
        });
    });
});

//follow
router.post('/:id/follow', function(req, res) {
    if (!req.session.channel) {
        return res.status(401).send({ error: 'Action not allowed!' });
    }
    
    channelapi.follow(req.session.channel, req.params.id, (error, channel) => {
        if (error || !channel) {
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        res.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': true,
        });
        return res.status(200).send();
    });
});

//follow
router.post('/:id/follow', function(req, res) {
    if (!req.session.channel) {
        return res.status(401).send({ error: 'Action not allowed!' });
    }
    
    channelapi.unfollow(req.session.channel, req.params.id, (error, channel) => {
        if (error || !channel) {
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        res.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': true,
        });
        return res.status(200).send();
    });
});

module.exports = router;
