function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    var id_token = googleUser.getAuthResponse().id_token;
    // if user authenticated
    if(typeof(Storage) !== undefined){
        // save token to update user data on server if requested
        localStorage.setItem('id_token', id_token);
        //add sign out link
        var signout = document.createElement('a');
        signout.href = '#';
        signout.onclick = signOut;
        signout.textContent = 'Sign Out';
        document.getElementById('g-signout2').appendChild(signout);
        // if user already authenticated do not notify server again
        if(localStorage.auth && localStorage.user._id == profile.getId())
            return;
    }
    else
        return;

    // if user not authenticated, send request to server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/' + id_token);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        var user = JSON.parse(xhr.responseText);
        if(user != null){
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('auth', true);
        }
    };
    xhr.send();
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
        localStorage.removeItem('id_token');
        location.reload();
    });
}
