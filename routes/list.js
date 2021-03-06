const express = require('express');

const listapi = require('../controllers/listapi');
const channelapi = require('../controllers/channelapi');

const router = express.Router();

router.get('/:id', (req, res, next) => {
  listapi
    .get(req.params.id)
    .then((list) => {
      if (!list) throw new Error('List not found');
      if (!req.session.login) return { list };

      return channelapi
        .get(req.session.login)
        .then((channel) => {
          if (!channel) throw new Error('Session lost');

          const state = {
            home: `/channel/${channel.id}`,
            owner: list.owner.id === channel.id,
            saved: channel.saved_lists.map(l => l.id).includes(req.params.id),
          };

          return { list, state };
        });
    })
    .then(data => res.render('list', data))
    .catch(next);
});

// add new list
router.post('/', (req, res, next) => {
  if (!req.session.login || !req.body.name || !req.body.filmid) {
    next(new Error('Access denied'));
    return;
  }

  listapi
    .add({
      owner: req.session.login,
      name: req.body.name,
      films: [req.body.filmid],
    })
    .then((list) => {
      res.redirect(`/list/${list.id}`);
    })
    .catch(next);
});

// update list name
router.post('/:id/update', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Access denied'));
    return;
  }

  listapi
    .get(req.params.id)
    .then((list) => {
      if (!list) throw new Error('List not found');

      if (list.owner.id !== req.session.login) throw new Error('Access denied');

      return listapi.update(list.id, { name: req.body.name });
    })
    .then(() => {
      res.redirect(`/list/${req.params.id}`);
    })
    .catch(next);
});

// save
router.post('/:id/save', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Access denied'));
    return;
  }

  channelapi
    .saveList(req.session.login, req.params.id)
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');

      res.status(200).send();
    })
    .catch(next);
});

// unsave
router.post('/:id/unsave', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Acces denied'));
    return;
  }

  channelapi
    .unsaveList(req.session.login, req.params.id)
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');

      res.status(200).send();
    })
    .catch(next);
});

// delete list
router.post('/:id/delete', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Access denied'));
    return;
  }

  listapi
    .get(req.params.id)
    .then((list) => {
      if (!list) throw new Error('List not found');

      if (list.owner.id !== req.session.login) throw new Error('Access denied');

      return listapi.remove(list.id);
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(next);
});

module.exports = router;
