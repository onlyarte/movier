window.onload = function(){
    let listbuttons = document.getElementsByClassName('list-button');

    for(let i = 0; i < listbuttons.length; i++){
        if(listbuttons[i].id && containsFilm(listbuttons[i].id)){
            listbuttons[i].style.opacity = 1;
        }
    }
}

function changeState(listid){
    if(containsFilm(listid)){
        removeFromList(listid);
    } else {
        addToList(listid);
    }
}

function containsFilm(listid){
    let list = channel._lists.find(function(element){
        return element._id == listid;
    });
    if(!list)
        return false;
    let film = list._films.find(function(element){
        return element._id == filmid;
    });
    if(film){
        return true;
    } else {
        return false;
    }
}

function addToList(listid){
    sendUpdateRequest('/film/' + filmid + '/tolist/' + listid);
}

function removeFromList(listid){
    sendUpdateRequest('/film/' + filmid + '/fromlist/' + listid);
}


//req is a url containing parameters
function sendUpdateRequest(req){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', req);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('req ' + req + ' processed');
    };
    xhr.send();
}
