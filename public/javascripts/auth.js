function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    // if user authenticated
    if(typeof(Storage) !== 'undefined' && localStorage.auth && localStorage.id == profile.getId())
        return;

    // if user not authenticated, send request to server
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/' + id_token);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('Signed in as: ' + xhr.responseText);
        if(typeof(Storage) !== 'undefined'){
            localStorage.setItem('auth', true);
            localStorage.setItem('id', profile.getId());
            localStorage.setItem('name', profile.getName());
            localStorage.setItem('imageURL', profile.getImageUrl());
        }
        else{
            alert('Please update your browser to sign in');
        }
    };
    xhr.send();
}
