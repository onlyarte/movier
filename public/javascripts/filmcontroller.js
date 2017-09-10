var filmid = document.getElementById('film-id').textContent;

function changeListState(listid){
    
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
