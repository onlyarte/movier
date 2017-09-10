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

        req.session.channel = channel._id;
        res.redirect('/channel/' + channel._id);
    });
});

//register
router.post('/new', function(req, res, next){

    var channel = {
        id: req.body.login,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        image: null,
        lists: [],
        saved_lists: []
    }

    //check if exists
    channelapi.findById(channel.id, function(error, channel){
        if(!error)
            return next(new Error('Login already exists'));

        saveImage();
    });

    //save image localy
    function saveImageLocally(){
        var path = './public/images/temp/' + channel.is + req.files.image.name;
        var file = req.files.image;
        file.mv(path, function(error) {
            if (error)
                return next(error);

            saveImageToCloud();
        });
    }

    //save image to cloudinary
    function saveImageToCloud(){
        cloudinary.v2.uploader.upload(path,
            { width: 1000, height: 1000,  crop: "limit" },
            function(error, result) {
                if(error)
                    return next(error);

                channel.image = result.url;
                saveChannel();
        });
    }

    //save channel to db
    function saveChannel(){
        channelapi.add(channel, function(error, channel){
            if(error)
                return next(error);

            addDefaultLists();
        });
    }

    //create and add defalt lists to channel
    function addDefaultLists(){
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

        redirect();
    }

    //save session var and redirect to channel
    function redirect(){
        req.session.channel = channel.id;
        res.redirect('/channel/' + channel.id);
    }

});

module.exports = router;
