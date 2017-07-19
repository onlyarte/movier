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
            fav.onclick = 'removeFav';
        }
        else{
            fav.src = '/images/icons/favfalse.png';
            fav.onclick = 'addFav';
        }

        var watchlist = document.createElement('img');
        watchlist.id = 'watchlist';
        if(isInWatchList){
            watchlist.src = '/images/icons/towatchtrue.png';
            watchlist.onclick = 'removeWatchlist';
        }
        else{
            watchlist.src = '/images/icons/towatchfalse.png';
            watchlist.onclick = 'addWatchlist';
        }

        var watched = document.createElement('img');
        watched.id = 'watched';
        if(isWatched){
            watched.src = '/images/icons/watchedtrue.png';
            watched.onclick = 'removeWatched';
        }
        else{
            watched.src = '/images/icons/watchedfalse.png';
            watched.onclick = 'addWatched';
        }

        controlls.appendChild(fav);
        controlls.appendChild(watchlist);
        controlls.appendChild(watched);
    }
}

function containsFilm(arr, filmId){
    function isFound(film) {
        return film.id == filmId;
    }

    return arr.find(isFound);
}

window.onload = showControlls;
