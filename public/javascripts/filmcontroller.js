function f_updateLB(filmid){
    let listbuttons = document.getElementsByClassName('list-button');

    for(let i = 0; i < listbuttons.length; i++){
        if(listbuttons[i].id && f_inList(listbuttons[i].id, filmid)){
            listbuttons[i].style.opacity = 0.7;
        }
        else{
            listbuttons[i].style.opacity = 0.5;
        }
    }
}

function f_clickedLB(listid, filmid){
    if(f_inList(listid, filmid)){
        f_removeFromL(listid, filmid, function(){
            location.reload();
        });
    } else {
        f_addToL(listid, filmid, function(){
            location.reload();
        });
    }
}

function f_inList(listid, filmid){
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

function f_addToL(listid, filmid, callback){
    sendUpdateRequest('/film/' + filmid + '/tolist/' + listid, callback);
}

function f_removeFromL(listid, filmid, callback){
    sendUpdateRequest('/film/' + filmid + '/fromlist/' + listid, callback);
}
