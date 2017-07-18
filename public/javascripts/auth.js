function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    /*console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());*/

    var id_token = googleUser.getAuthResponse().id_token;

    var http = new XMLHttpRequest();
    var url = '/auth/' + id_token;
    http.open("POST", url, true);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            alert('Congrats');
        }
    }
    http.send('Auth request');
}