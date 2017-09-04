var express = require('express');
var router = express.Router();
var channelapi = require('../controllers/channelapi');
var fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary');

//log in
router.post('/', function(req, res, next) {
    channelapi.findById(req.params.login, function(error, channel){
        if(error)
            res.render('index', { title: 'MOVIER' });
        else {
            req.session.channel = channel;
            res.redirect('/channel/' + channel._id);
        }
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
                        name: req.body.password,
                        image: result.url,
                        lists: [],
                        saved_lists: []
                    }

                    channelapi.add(newchannel);
                    res.redirect('/channel/' + newchannel.id);
                });
        });
    });
});

module.exports = router;
