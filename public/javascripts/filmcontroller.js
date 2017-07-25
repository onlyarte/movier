function showControlls() {
    if(typeof(Storage) !== 'undefined' && localStorage.auth){
        var user = JSON.parse(localStorage.user);
        var controlls = document.getElementById('controlls');
        var filmId = document.getElementById('id').innerHTML;
        var isFav = containsFilm(user._films._favs, filmId);
        var isInWatchList = containsFilm(user._films._watchlist, filmId);
        var isWatched = containsFilm(user._films._watched, filmId);

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
            localStorage.setItem('user', JSON.parse(user));
        }
    };
    xhr.send();
}

function containsFilm(arr, filmId){

    function equals(current, index, array){
        return current._id == filmId;
    }

    var res = arr.find(equals);

    if(res == undefined)
        return false;
    else
        return true;
}

window.onload = showControlls;
