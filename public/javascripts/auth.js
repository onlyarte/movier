function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    var id_token = googleUser.getAuthResponse().id_token;
    // if user authenticated
    if(typeof(Storage) !== 'undefined'){
        // save token to update user data on server if requested
        localStorage.setItem('id_token', id_token);
        // if user already authenticated do not notify server again
        if(localStorage.auth && localStorage.id == profile.getId())
            return;
    }
    else
        return;

    // if user not authenticated, send request to server
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/' + id_token);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);
        console.log(xhr.responseText);
        localStorage.setItem('auth', true);
        localStorage.setItem('id', profile.getId());
        localStorage.setItem('name', profile.getName());
        localStorage.setItem('imageURL', profile.getImageUrl());
    };
    xhr.send();
}
