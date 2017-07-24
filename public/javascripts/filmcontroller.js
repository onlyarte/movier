function showControlls() {
    if(typeof(Storage) !== 'undefined' && localStorage.auth){
        var user = JSON.parse(localStorage.user);
        var controlls = document.getElementById('controlls');
        var filmId = document.getElementById('id').innerHTML;
        var isFav = containsFilm(user.films.favs, filmId);
        var isInWatchList = containsFilm(user.films.watchlist, filmId);
        var isWatched = containsFilm(user.films.watched, filmId);

        var fav = document.createElement('img');
        fav.id = 'fav';
        if(isFav){
            fav.src = '/images/icons/favtrue.png';
            fav.onclick = function(){
                sendUpdateRequest('/update/' + localStorage.id_token + '/removeFromFav/' + filmId);
                removeControlls();
                showControlls();
            };
        }
        else{
            fav.src = '/images/icons/favfalse.png';
            fav.onclick = function(){
                sendUpdateRequest('/update/' + localStorage.id_token + '/addToFav/' + filmId);
                removeControlls();
                showControlls();
            };
        }

        var watchlist = document.createElement('img');
        watchlist.id = 'watchlist';
        if(isInWatchList){
            watchlist.src = '/images/icons/towatchtrue.png';
            watchlist.onclick = function(){
                sendUpdateRequest('/update/' + localStorage.id_token + '/removeFromWatchlist/' + filmId);
                removeControlls();
                showControlls();
            };
        }
        else{
            watchlist.src = '/images/icons/towatchfalse.png';
            watchlist.onclick = function(){
                sendUpdateRequest('/update/' + localStorage.id_token + '/addToWatchlist/' + filmId);
                removeControlls();
                showControlls();
            };
        }

        var watched = document.createElement('img');
        watched.id = 'watched';
        if(isWatched){
            watched.src = '/images/icons/watchedtrue.png';
            watched.onclick = function(){
                sendUpdateRequest('/update/' + localStorage.id_token + '/removeFromWatched/' + filmId);
                removeControlls();
                showControlls();
            };
        }
        else{
            watched.src = '/images/icons/watchedfalse.png';
            watched.onclick = function(){
                sendUpdateRequest('/update/' + localStorage.id_token + '/addToWatched/' + filmId);
                removeControlls();
                showControlls();
            };
        }

        controlls.appendChild(fav);
        controlls.appendChild(watchlist);
        controlls.appendChild(watched);
    }
}

function removeControlls(){
    var controlls = document.getElementById('controlls');
    while(controlls.firstChild){
        controlls.removeChild(controlls.firstChild);
    }
}

//req is a url containing parameters
function sendUpdateRequest(req){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', req);
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

function containsFilm(arr, filmId){
    if(arr.length == 0)
        return false;

    function isFound(film) {
        return film.id == filmId;
    }

    var res = arr.find(isFound);

    if(res == 'undefined'){
        console.log('not contains')
        return false;
    }
    else{
        console.log('contains ' + res);
        return true;
    }
}

window.onload = showControlls;
