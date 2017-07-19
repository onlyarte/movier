function showControlls() {
    if(typeof(Storage) !== 'undefined' && localStorage.auth){
        var user = JSON.parse(localStorage.user);
        var controlls = document.getElementById('controlls');
        var filmId = controlls.filmId;
        var isFav = containsFilm(user.films.favs, filmId);
        var isInWatchList = containsFilm(user.films.watchlist, filmId);
        var isWatched = containsFilm(user.films.watched, filmId);

        var fav = document.createElement('img');
        fav.id = 'fav';
        if(isFav){
            fav.src = '/images/icons/favtrue.png';
            fav.onclick = removeFromFav();
        }
        else{
            fav.src = '/images/icons/favfalse.png';
            fav.onclick = addToFav();
        }

        var watchlist = document.createElement('img');
        watchlist.id = 'watchlist';
        if(isInWatchList){
            watchlist.src = '/images/icons/towatchtrue.png';
            watchlist.onclick = removeFromWatchlist();
        }
        else{
            watchlist.src = '/images/icons/towatchfalse.png';
            watchlist.onclick = addToWatchlist();
        }

        var watched = document.createElement('img');
        watched.id = 'watched';
        if(isWatched){
            watched.src = '/images/icons/watchedtrue.png';
            watched.onclick = removeFromWatched();
        }
        else{
            watched.src = '/images/icons/watchedfalse.png';
            watched.onclick = addToWatched();
        }

        controlls.appendChild(fav);
        controlls.appendChild(watchlist);
        controlls.appendChild(watched);
    }
}

function containsFilm(arr, filmId){
    if(arr.length == 0)
        return false;

    function isFound(film) {
        return film.id == filmId;
    }

    var res = arr.find(isFound);

    if(res === 'undefined'){
        console.log('not contains')
        return false;
    }
    else{
        console.log('contains ' + res);
        return true;
    }
}

window.onload = showControlls;
