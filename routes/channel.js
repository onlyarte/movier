const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const channelapi = require('../controllers/channelapi');

const router = express.Router();

router.get('/:id', (req, res, next) => {
  channelapi
    .get(req.params.id)
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');
      if (!req.session.login) return { channel };

      return channelapi
        .get(req.session.login)
        .then((userchannel) => {
          if (!userchannel) throw new Error('Session lost');

          const state = {
            home: `/channel/${userchannel.id}`,
            owner: channel.id === userchannel.id,
            following: channel.id === userchannel.id && userchannel.following,
            isFollowed: userchannel.following.filter(elem => elem.id === channel.id).length > 0,
          };

          return { channel, state };
        });
    })
    .then(data => res.render('channel', data))
    .catch(next);
});

router.post('/update', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Access denied'));
    return;
  }

  channelapi
    .update({
      id: req.session.login,
      email: req.body.email,
      password: req.body.password && bcrypt.hashSync(req.body.password), // encrypt password
      name: req.body.name,
      image: null,
    })
    .then((channel) => {
      if (!channel) throw new Error('Failed to save new data');

      res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
      });
      res.status(200).send();
    })
    .catch(next);
});

// follow
router.post('/:id/follow', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Access denied'));
    return;
  }

  channelapi
    .follow(req.session.login, req.params.id)
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');

      res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
      });
      res.status(200).send();
    })
    .catch(next);
});

// unfollow
router.post('/:id/unfollow', (req, res, next) => {
  if (!req.session.login) {
    next(new Error('Access denied'));
    return;
  }

  channelapi
    .unfollow(req.session.login, req.params.id)
    .then((channel) => {
      if (!channel) throw new Error('Channel not found');

      res.set({
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
      });
      res.status(200).send();
    })
    .catch(next);
});

module.exports = router;
