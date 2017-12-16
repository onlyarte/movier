const express       = require('express');
const router        = express.Router();

const filmapi       = require('../controllers/filmapi');
const listapi       = require('../controllers/listapi');
const channelapi    = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    filmapi.get(req.params.id, (error, film) => {
        if (error) return next(error);
        if (!film) return next(new Error('Film not found'));

        if (!req.session.channel){
            return res.render('film', { film } );
        }

        channelapi.get(req.session.channel, (error, channel) => {
            if (error) return next(error);
            if (!channel) return next(new Error('Please, log in again'));
            
            const state = {
                lists: channel.lists, // list objects
                inLists: channel.lists.filter(list => list.films.includes(req.params.id)) // list ids
            }

            return res.render('film', { film, state });
        });
    });
});

router.get('/search/:title', function (req, res, next) {
    filmapi.search(req.params.title, (error, searchRes) => {
        if (error) res.send('');
        res.send(searchRes);
    });
});

//add film to list
router.post('/:filmid/tolist/:listid', function(req, res, next) {
    if (!req.session.channel) { // if user is not logged in
        return res.status(401).send({ error: 'Action not allowed!' });
    }

    listapi.get(req.params.listid, (error, list) => {
        if (error || !list || list.owner !== req.session.channel) {
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        listapi.addFilm(req.params.listid, req.params.filmid, (error, list) => {
            if (error) {
                return res.status(401).send({ error: 'Action not allowed!' });
            }
            
            res.set({
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
            });
            return res.status(200).send();
        });
    });
});

//remove film from list
router.post('/:filmid/fromlist/:listid', function(req, res, next){
    if (!req.session.channel) { // if user is not logged in
        return res.status(401).send({ error: 'Action not allowed!' });
    }

    listapi.get(req.params.listid, (error, list) => {
        if (error || !list || list.owner !== req.session.channel) { // if user is not list owner
            return res.status(401).send({ error: 'Action not allowed!' });
        }

        listapi.removeFilm(req.params.listid, req.params.filmid, (error, list) => {
            if (error || !list) {
                return res.status(401).send({ error: 'Action not allowed!' });
            }
            
            res.set({
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': true,
            });
            return res.status(200).send();
        });
    });
});

module.exports = router;
