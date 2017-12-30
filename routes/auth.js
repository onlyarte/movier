const express = require('express');
const cloudinary = require('cloudinary');
const bcrypt = require('bcrypt-nodejs');

const channelapi = require('../controllers/channelapi');

const router = express.Router();

// log in
router.post('/', (req, res, next) => {
  if (!req.body.login || !req.body.password) {
    next(new Error('Empty login request'));
    return;
  }

  channelapi
    .getPassword(req.body.login)
    .then((password) => {
      if (!password || !bcrypt.compareSync(req.body.password, password)) {
        throw new Error('Wrong password');
      }
      req.session.login = req.body.login;
      res.redirect(`/channel/${req.body.login}`);
    })
    .catch(next);
});

// log out
router.get('/out', (req, res, next) => {
  if (!req.session) {
    res.redirect('/');
    return;
  }

  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.redirect('/');
  });
});

// register
router.post('/new', (req, res, next) => {
  if (!req.body.login || !req.body.email || !req.body.password || !req.body.name) {
    next(new Error('Fill in all the fields'));
    return;
  }

  channelapi
    .get(req.body.login)
    .then(
      // exit if login is taken
      () => {
        throw new Error('Login is already taken');
      },
      // save image to local storage
      () => new Promise((resolve, reject) => {
        const imgLocalPath = `./public/images/temp/${req.body.login + req.files.image.name}`;
        req.files.image.mv(
          imgLocalPath,
          (error) => {
            if (error) reject(error);
            resolve(imgLocalPath);
          },
        );
      }),
    )
  // save image on cloudinary
    .then(imgLocalPath => new Promise((resolve, reject) => {
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
    }))
  // save channel to database
    .then(imgGlobalPath => channelapi.add({
      _id: req.body.login,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      name: req.body.name,
      image: imgGlobalPath,
    }))
  // set session, and redirect to channel
    .then((channel) => {
      if (!channel) throw new Error('Failed to save new channel');
      req.session.login = channel.id;
      res.redirect(`/channel/${channel.id}`);
    })
  // send errors
    .catch(next);
});

module.exports = router;
