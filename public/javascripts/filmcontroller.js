var filmid = document.getElementById('film-id').textContent;

function changeState(listid){
    var list = channel._lists.find(function(element){
        return element._id == listid;
    });
    var film = list._films.find(function(element){
        return element._id == filmid;
    });
    if(film){
        removeFromList(listid);
    } else {
        addToList(listid);
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
    var xhr = new XMLHttpRequest();
    xhr.open('POST', req);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('req ' + req + ' processed');
    };
    xhr.send();
}
