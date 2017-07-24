var express = require('express');
var router = express.Router();
var userapi = require('../controllers/userapi');
var GoogleAuth = require('google-auth-library');
var CLIENT_ID = '409529861195-h34jm5fsvrdfoagfl2bg71u4c59243o7.apps.googleusercontent.com';
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');

router.post('/:token/:type/:value', function(req, res, next) {
    client.verifyIdToken(
    req.params.token,
    CLIENT_ID,
    function(err, login) {
        if(err){
            res.send('');
        }
        else{
            var payload = login.getPayload();
            var userid = payload['sub'];

            var sendRes = function(user){
                if(user == null)
                    res.send('');
                else
                    res.send(JSON.stringify(user));
            }

            // delegate acction to userapi
            switch (req.params.type) {
                case 'addToFav':
                    userapi.addToFav(userid, req.params.value, sendRes);
                    break;
                case 'addToWatchlist':
                    userapi.addToWatchlist(userid, req.params.value, sendRes);
                    break;
                case 'addToWatched':
                    userapi.addToWatched(userid, req.params.value, sendRes);
                    break;
                case 'removeFromFav':
                    userapi.removeFromFav(userid, req.params.value, sendRes);
                    break;
                case 'removeFromWatchlist':
                    userapi.removeFromWatchlist(userid, req.params.value, sendRes);
                    break;
                case 'removeFromWatched':
                    userapi.removeFromWatched(userid, req.params.value, sendRes);
                    break;
                default:
                    res.send('');
            }
        }
    });
});

module.exports = router;
