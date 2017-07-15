var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:filmid', function(req, res, next) {
  res.send('film #' + req.params.filmid + ' requested');
});

module.exports = router;
