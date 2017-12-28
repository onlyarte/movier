const express = require('express');

const listapi = require('../controllers/listapi');

const router = express.Router();

router.get('/', (req, res, next) => {
  const coverId = '5a3b7c66a29c9a1abca7dfa1';

  if (req.session.login) {
    res.redirect(`/list/${coverId}`);
    return;
  }

  listapi
    .get(coverId)
    .then((list) => {
      if (!list) throw new Error('Cover not found');

      res.render('index', { list, title: 'THE MOVIER' });
    })
    .catch(next);
});

module.exports = router;
