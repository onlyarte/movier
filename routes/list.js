var express = require('express');
var router = express.Router();
var listapi = require('../controllers/listapi');
var channelapi = require('../controllers/channelapi');

router.get('/:id', function(req, res, next) {
    listapi.findById(req.params.id, function(error, list){
        if(error)
            return next(error);

        //res.render('list', list);
        res.send(list);
    });
});

//TO DO: replace owner with session variable
//add new list
router.post('/', function(req, res, next){
    var list = JSON.parse(req.body);
    list.owner = 'session_id';
    listapi.add(list, function(error, list){
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
router.post('/:id/save/:channelid', function(req, res, next) {
    channelapi.saveList(req.params.channelid, req.params.id, function(error, channel){
        if(error)
            return next(error);

        res.send(channel);
    });
});

//remove from channel
router.post('/:id/save/:channelid', function(req, res, next) {
    channelapi.removeFromSaved(req.params.channelid, req.params.id, function(error, channel){
        if(error)
            return next(error);

        res.send(channel);
    });
});

module.exports = router;
