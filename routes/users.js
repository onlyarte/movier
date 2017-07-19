var express = require('express');
var router = express.Router();
var userapi = require('../controllers/userapi');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    userapi.findById(req.params.id, function(user){
        console.log(user);
        if(user == null)
            res.render('error');
        else{
            res.render('user', {
                name: user._name,
                image: user._image,
                films: {
                    favs: user._films._favs,
                    watchlist: user._films._watchlist,
                    watched: user._films._watched
                }
            });
        }
    });
});

module.exports = router;
