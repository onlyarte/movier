const express = require('express');
const router = express.Router();
const channelapi = require('../controllers/channelapi');
const listapi = require('../controllers/listapi');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'MOVIER' });
    /*if(req.session.channel){
        res.redirect('/list/59dc82011ed8420012bea72a');
    } else {
        listapi.findById('59dc82011ed8420012bea72a', function(error, coverlist){
            if(error)
                return next(error);

            res.render('index', { title: 'MOVIER', list: coverlist });
        });
    }*/
});

module.exports = router;
