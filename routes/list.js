var express = require('express');
var router = express.Router();
var listapi = require('../controllers/listapi');

router.get('/:id', function(req, res, next) {
    listapi.findById(req.params.id, function(error, list){
        if(error)
            return next(error);

        res.render('list', list);
    });
});

module.exports = router;
