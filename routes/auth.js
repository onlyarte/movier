var express = require('express');
var router = express.Router();
var GoogleAuth = require('google-auth-library');
var CLIENT_ID = '409529861195-h34jm5fsvrdfoagfl2bg71u4c59243o7.apps.googleusercontent.com';
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');

router.post('/:token', function(req, res, next) {
    client.verifyIdToken(
    req.params.token,
    CLIENT_ID,
    function(err, login) {
        if(err)
            return;
        var payload = login.getPayload();
        var userid = payload['sub'];
        var useremail = payload['email'];
        var username = payload['name'];
        console.log('user authenticated #' + userid + ' / ' + useremail + ' / ' + username);
    });
});

module.exports = router;
