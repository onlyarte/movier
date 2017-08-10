function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    var id_token = googleUser.getAuthResponse().id_token;
    // if user authenticated
    if(typeof(Storage) === undefined)
        return;

    // save token to update user data on server if requested
    localStorage.setItem('id_token', id_token);

    //add sign out link
    var login = document.getElementById('log-in');
    login.parentNode.removeChild(login);

    var logout_link = document.createElement('a'); logout_link.href = '#'; logout_link.onclick = signOut; logout_link.textContent = 'Выйти';
    document.getElementById('log-out').appendChild(logout_link);

    var userimg_link = document.createElement('a'); userimg_link.href = '/users/' + localStorage.user.id + '/';
    var userimg_pic = document.createElement('img'); userimg_pic.src = localStorage.user.image; userimg_link.appendChild(userimg_pic);
    document.getElementById('user-img').appendChild(userimg_link);

    var username_link = document.createElement('a'); username_link.href = '/users/' + localStorage.user.id + '/'; username_link.textContent = localStorage.user.name;
    document.getElementById('user-name').appendChild(username_link);

    // if user authenticated, do not send request to server
    if(localStorage.getItem('auth') !== null)
        return;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/' + id_token);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        var user = JSON.parse(xhr.responseText);
        if(user != null){
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('auth', true);

            location.reload();
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
