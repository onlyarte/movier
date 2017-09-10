var express = require('express');
var router = express.Router();
var channelapi = require('../controllers/channelapi');
var listapi = require('../controllers/listapi');
var fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary');

//log in
router.post('/', function(req, res, next) {
    channelapi.findById(req.body.login, function(error, channel){
        if(error)
            return next(error);
        if(channel._password != req.body.password)
            return next(new Error('Wrong password'));

        req.session.channel = channel;
        res.redirect('/channel/' + channel._id);
    });
});

//register
router.post('/new', function(req, res, next){
    //check if exists
    channelapi.findById(req.body.login, function(error, channel){
        if(!error)
            return next(new Error('Login already exists'));
    });

    var channel = {
        id: req.body.login,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        image: null,
        lists: [],
        saved_lists: []
    }

    //save image localy
    var path = './public/images/temp/' + req.body.login + req.files.image.name;
    var file = req.files.image;
    file.mv(path, function(error) {
        if (error)
            return next(error);
    });

    //save iage to cloudinary
    cloudinary.v2.uploader.upload(path,
        { width: 1000, height: 1000,  crop: "limit" },
        function(error, result) {
            if(error)
                return next(error);

            channel.image = result.url;
    });

    //save channel to db
    channelapi.add(channel, function(error, channel){
        if(error)
            return next(error);
    });

    //create and add defalt lists to channel
    var addList = function(name){
        listapi.add({
            owner: channel.id,
            is_open: false,
            name: name,
            films: []
        }, function(error, list){
            if(error)
                return next(error);

            channelapi.addList(channel.id, list._id, function(error, channel){
                if(error)
                    return next(error);
            });
        });
    };
    addList('Любимые');
    addList('Просмотренные');
    addList('Буду смотреть');

    //save channel as session variable
    channelapi.findById(channel.id, function(error, populated_channel){
        if(error)
            return next(error);

        req.session.channel = populated_channel;
        res.redirect('/channel/' + populated_channel._id);
    });

});

module.exports = router;
