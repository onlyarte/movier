const express       = require('express');
const router        = express.Router();

const listapi       = require('../controllers/listapi');
const channelapi    = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    listapi.get(req.params.id, (error, list) => {
        if (error) return next(error);
        if (!list) return next(new Error('List not found'));

        if (!req.session.channel){
            return res.render('list', { list });
        }

        channelapi.get(req.session.channel, (error, channel) => {
            if (error) return next(error);
            if (!channel) return next(new Error('Please, log in again'));
            
            const state = {
                owner: list.owner === channel.id ? true : false,
            }

            return res.render('list', { list, state });
        });
    });
});

//add new list
router.post('/', function(req, res, next){
    if (!req.session.channel || !req.body.name || !req.body.filmid) { // if user is not logged in
        return res.status(401).send({ error: 'Action not allowed!' });
    }

    const list = {
        owner: req.session.channel,
        name: req.body.name,
    };

    listapi.add(list, req.body.filmid, (error, list) => {
        if (error || !list) {
            return res.status(400).send({ error: 'Action not allowed!' });
        }
        
        return res.status(200).send();
    });
});

//delete list
router.delete('/:id', function(req, res, next){
    if (!req.session.channel) { // if user is not logged in
        return res.status(401).send({ error: 'Action not allowed!' });
    }

    listapi.get(req.params.id, (error, list) => {
        if (error || !list || list.owner !== req.session.channel) {
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        listapi.remove(req.params.id, error => {
            if(error) {
                return res.status(401).send({ error: 'Action not allowed!' });
            }
    
            return res.status(200).send();
        });
    });
});

//save to channel
router.post('/:id/save', function(req, res, next) {
    if (!req.session.channel) {
        return res.status(401).send({ error: 'Action not allowed!' });
    }

    channelapi.saveList(req.session.channel, req.params.id, (error, channel) => {
        if (error || !channel) {
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        return res.status(200).send();
    });
});

//remove from channel
router.post('/:id/remove', function(req, res, next) {
    if (!req.session.channel) {
        return res.status(401).send({ error: 'Action not allowed!' });
    }
    
    channelapi.removeFromSaved(req.session.channel, req.params.id, (error, channel) => {
        if (error || !channel) {
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        return res.status(200).send();
    });
});

module.exports = router;
