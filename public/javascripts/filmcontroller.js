window.onload = function(){
    updateOpacity();
}

function updateOpacity(){
    let listbuttons = document.getElementsByClassName('list-button');

    for(let i = 0; i < listbuttons.length; i++){
        if(listbuttons[i].id && containsFilm(listbuttons[i].id)){
            listbuttons[i].style.opacity = 1;
        }
        else{
            listbuttons[i].style.opacity = 0.6;
        }
    }
}

function changeState(listid){
    if(containsFilm(listid)){
        removeFromList(listid, function(){
            location.reload();
        });
    } else {
        addToList(listid, function(){
            location.reload();
        });
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

function addToList(listid, callback){
    sendUpdateRequest('/film/' + filmid + '/tolist/' + listid, callback);
}

function removeFromList(listid, callback){
    sendUpdateRequest('/film/' + filmid + '/fromlist/' + listid, callback);
}
