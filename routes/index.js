const express = require('express');
const router = express.Router();
const channelapi = require('../controllers/channelapi');
const listapi = require('../controllers/listapi');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.channel){
        channelapi.findById(req.session.channel, function(error, channel){
            if(error)
                return next(error);

            listapi.findById('59dc82011ed8420012bea72a', function(error, coverlist){
                if(error)
                return next(error);

                channel._password = null;
                res.render('index', { title: 'MOVIER', authch: channel, list: coverlist });
            });
        });
    } else {
        listapi.findById('59dc82011ed8420012bea72a', function(error, coverlist){
            if(error)
            return next(error);

            res.render('index', { title: 'MOVIER', list: coverlist });
        });
    }
});

module.exports = router;
