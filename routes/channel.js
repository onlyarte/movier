const express = require('express');
const cloudinary = require('cloudinary');
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

  new Promise((resolve, reject) => {
    if (!req.files.image) resolve(null);

    const path = `./public/images/temp/${req.session.login + req.files.image.name}`;

    req.files.image
      .mv(
        path,
        (error) => {
          if (error) reject(error);
          resolve(path);
        },
      );
  })
    .then((imgLocalPath) => {
      if (!imgLocalPath) return null;

      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          imgLocalPath,
          {
            crop: 'fill',
            aspect_ratio: '1:1',
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result.url);
          },
        );
      });
    })
    .then(imgGlobalPath => channelapi.update({
      id: req.session.login,
      email: req.body.email === '' ? null : req.session.email,
      password: req.body.password === '' ? null : bcrypt.hashSync(req.body.password),
      name: req.body.name === '' ? null : req.body.name,
      image: imgGlobalPath,
    }))
    .then((updated) => {
      if (!updated) throw new Error('Failed to update channel');

      res.redirect(`/channel/${req.session.login}`);
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
