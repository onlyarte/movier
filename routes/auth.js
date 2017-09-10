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

    channelapi.findById(req.body.login, function(error, channel){
        if(!error)
            return next(new Error('Login already exists'));

        //save image localy
        var path = './public/images/temp/' + req.body.login + req.files.image.name;
        var file = req.files.image;
        file.mv(path, function(error) {
            console.log('tried to save localy');
            if (error){
                console.log(error);
                return next(error);
            }

            console.log('saved localy');
            cloudinary.v2.uploader.upload(path,
                {width: 1000, height: 1000, crop: "limit"},
                function(error, result) {
                    if(error)
                        return next(error);
                    console.log('saved to cloud');
                    var newchannel = {
                        id: req.body.login,
                        email: req.body.email,
                        password: req.body.password,
                        name: req.body.name,
                        image: result.url,
                        lists: [],
                        saved_lists: []
                    };

                    channelapi.add(newchannel, function(error, added_channel){
                        var addList = function(_name){
                            listapi.add({
                                owner: added_channel._id,
                                is_open: false,
                                name: _name,
                                films: []
                            }, function(error, list){
                                if(!error)
                                    added_channel._lists.push(list._id);
                            });
                        };

                        addList('Любимые'); addList('Просмотренные'); addList('Буду смотреть');
                        added_channel.save();
                        channelapi.findById(added_channel._id, function(error, populated_channel){
                            if(error)
                                return next(error);

                            req.session.channel = populated_channel;
                            res.redirect('/channel/' + populated_channel._id);
                        });
                    });
                });
        });
    });
});

module.exports = router;
