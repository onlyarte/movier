const express       = require('express');
const router        = express.Router();
const fileUpload    = require('express-fileupload');
const cloudinary    = require('cloudinary');
const bcrypt        = require('bcrypt-nodejs');

const channelapi    = require('../controllers/channelapi');
const listapi       = require('../controllers/listapi');

//log in
router.post('/', function (req, res, next) {
    channelapi.getPassword(req.body.login, (error, password) => {
        if(error || !password || !bcrypt.compareSync(req.body.password, password)) { // compare passwords
            return next(new Error('Wrong login or password'));
        } 

        req.session.channel = req.body.login;
        return res.redirect('/channel/' + req.body.login);
    });
});

//register
router.post('/new', function (req, res, next){
    if(!req.body.login || !req.body.email || !req.body.password || !req.body.name){
        return next(new Error("All the fields needed"));
    }

    const channel = {
        _id: req.body.login,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password), // encrypt password
        name: req.body.name,
        image: 'https://www.standard.co.uk/s3fs-public/styles/story_large/public/thumbnails/image/2017/04/27/13/mendeodorant.jpg',
        saved_lists: [],
        following: [],
    }

    console.log(channel);

    const imgPath = './public/images/temp/' + channel.id + req.files.image.name;

    //check if account exists
    channelapi.get(channel.id, (error, channel) => {
        if (channel) return next(new Error('Login already exists'));

        saveChannel();
    });

    //save image localy
    function saveImageLocally(){
        const file = req.files.image;

        file.mv(imgPath, error => {
            if (error) return next(error);

            saveImageToCloud();
        });
    }

    //save image to cloudinary
    function saveImageToCloud(){
        cloudinary.v2.uploader.upload(
            imgPath,
            { 
                crop: "fill", 
                aspect_ratio: "1:1",
            },
            (error, result) => {
                if (error) return next(error);

                channel.image = result.url;
                saveChannel();
        });
    }

    //save channel to db
    function saveChannel(){
        channelapi.add(channel, (error, channel) => {
            if (error) return next(error);
            if (!channel) return next(new Error('Temporary not available'));

            redirect();
        });
    }

    //save session var and redirect to channel
    function redirect(){
        req.session.channel = channel._id;
        return res.redirect('/channel/' + channel._id);
    }
});

module.exports = router;
