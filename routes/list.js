const express = require('express');
const router = express.Router();
const listapi = require('../controllers/listapi');
const channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    listapi.findById(req.params.id, function(error, list){
        if(error)
            return next(error);

        if(req.session.channel){
            channelapi.findById(req.session.channel, function(error, channel){
                if(error)
                    next(error);
                channel._password = null;
                res.render('list', { list: list, authch: channel});
            });
        } else {
            res.render('list', { list : list });
        }
    });
});

//add new list
router.post('/', function(req, res, next){
    let list = {
        is_open: false,
        owner: req.session.channel,
        name: req.body.name,
        films: []
    };
    listapi.addAndSave(list, req.body.filmid, function(error, list){
        if(error)
            return next(error);

        //res.render('list', list);
        res.send(list);
    });
});

//delete list
router.delete('/:id', function(req, res, next){
    listapi.remove(req.params.id, function(error){
        if(error)
            return next(error);

        res.send('');
    });
});

//TO DO: replace channelid with session variable
//save to channel
router.post('/:id/save', function(req, res, next) {
    channelapi.saveList(req.session.channel._id, req.params.id, function(error, channel){
        if(error)
            return next(error);

        res.send(channel);
    });
});

//remove from channel
router.post('/:id/remove', function(req, res, next) {
    channelapi.removeFromSaved(req.session.channel._id, req.params.id, function(error, channel){
        if(error)
            return next(error);

        res.send(channel);
    });
});

module.exports = router;
