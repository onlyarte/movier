const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MOVIER', authch: req.session.channel });
});

module.exports = router;
