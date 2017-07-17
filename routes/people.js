var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:personid', function(req, res, next) {
  res.send('person #' + req.params.personid + ' requested');
});

module.exports = router;
