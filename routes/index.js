const express = require('express');

const listapi = require('../controllers/listapi');

const router = express.Router();

router.get('/', (req, res, next) => {
  const coverId = process.env.ind_cover || '5a3f6a213ba5cf00142dab47';

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
