const express = require('express');
const router = express.Router();
const channelapi = require('../controllers/channelapi');
const listapi = require('../controllers/listapi');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.channel){
        res.redirect('/list/5a3b7c66a29c9a1abca7dfa1');
    } else {
        listapi.get('5a3b7c66a29c9a1abca7dfa1', function(error, list){
            if(error || !list)
                return next(error);

            res.render('index', { title: 'MOVIER', list: list });
        });
    }
});

module.exports = router;
