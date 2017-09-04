var express = require('express');
var router = express.Router();
var channelapi = require('../controllers/channelapi');
var fileUpload = require('express-fileupload');
var cloudinary = require('cloudinary');

//log in
router.post('/', function(req, res, next) {
    //Check that the fields are not empty
    req.checkBody('login', 'Login required').notEmpty();
    req.checkBody('password', 'Password required').notEmpty();

    //Trim and escape the fields.
    req.sanitize('login').escape(); req.sanitize('login').trim();

    //Run the validators
    var errors = req.validationErrors();
    if(errors){
        res.render('index', { title: 'MOVIER' });
    } else {
        channelapi.findById(req.params.login, function(error, channel){
            if(error)
                res.render('index', { title: 'MOVIER' });
            else {
                req.session.channel = channel;
                res.redirect('/channel/' + channel._id);
            }
        });
    }
});

//register
router.post('/new', function(req, res, next){
    console.log('req');
    console.log(req.body.login);
    console.log(req.body.password);

    channelapi.findById(req.params.login, function(error, channel){
        if(!error)
            return next(new Error('Login already exists'));

        //save image localy
        var path = '../public/images/temp/' + req.params.login + req.files.image.name;
        var file = req.files.image;
        file.mv(path, function(error) {
            if (error)
                return next(error);
            cloudinary.v2.uploader.upload(path, function(error, result) {
                if(error)
                    return next(error);
                console.log('saved to cloud');
                var newchannel = {
                    id: req.params.login,
                    email: req.params.email,
                    password: req.params.password,
                    name: req.params.password,
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
