const express = require('express');

const filmapi = require('../controllers/filmapi');
const listapi = require('../controllers/listapi');
const channelapi = require('../controllers/channelapi');

const router = express.Router();

router.get('/:id', (req, res, next) => {
  filmapi
    .get(req.params.id)
    .then((film) => {
      if (!film) throw Error('Film not found');

      if (!req.session.login) return { film };

      return channelapi
        .get(req.session.login)
        .then((userchannel) => {
          if (!userchannel) throw new Error('Session lost');

          return {
            film,
            state: {
              lists: userchannel.lists,
              inLists: userchannel.lists
                .filter(list => list.films.includes(req.params.id)) // lists containing the film
                .map(list => list.id), // ids
              home: `/channel/${userchannel.id}`,
            },
          };
        });
    })
    .then((data) => {
      res.render('film', data);
    })
    .catch(next);
});

router.get('/search/:title', (req, res, next) => {
  filmapi.search(req.params.title)
    .then((films) => {
      if (!films) throw new Error('Search temporary not available');

      res.send(films);
    })
    .catch(next);
});

// add film to list
router.post('/:filmid/tolist/:listid', (req, res, next) => {
  if (!req.session.login) { // if user is not logged in
    next(new Error('Access denied'));
    return;
  }

  listapi
    .get(req.params.listid)
    .then((list) => {
      if (!list) throw new Error('List not found');
      if (list.owner.id !== req.session.login) throw new Error('Access denied');

      return listapi
        .addFilm(req.params.listid, req.params.filmid);
    })
    .then((list) => {
      if (!list) throw new Error('Failed to add film to list. Try again later.');

      res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
      });
      res.send();
    })
    .catch(next);
});

// remove film from list
router.post('/:filmid/fromlist/:listid', (req, res, next) => {
  if (!req.session.login) { // if user is not logged in
    next(new Error('Access denied'));
    return;
  }

  listapi
    .get(req.params.listid)
    .then((list) => {
      if (!list) throw new Error('List not found');
      if (list.owner.id !== req.session.login) throw new Error('Access denied');

      return listapi
        .removeFilm(req.params.listid, req.params.filmid);
    })
    .then((list) => {
      if (!list) throw new Error('Failed to remove film from list. Try again later.');

      res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
      });
      res.send();
    })
    .catch(next);
});

module.exports = router;
