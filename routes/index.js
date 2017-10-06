const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.channel){
        channelapi.findById(req.session.channel, function(error, channel){
            if(error)
                next(error);
            channel.password = null;
            res.render('index', { title: 'MOVIER', authch: channel });
        });
    } else {
        res.render('index', { title: 'MOVIER' });
    }
});

module.exports = router;
