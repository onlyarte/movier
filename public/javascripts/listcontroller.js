window.onload = function(){
    updateListSaveButton();
}

function saveList(callback){
    sendUpdateRequest('/list/' + listid + '/save/', callback);
}

function removeListFromSaved(callback){
    sendUpdateRequest('/list/' + listid + '/remove/', callback);
}

function updateListSaveButton(){
    if(isSaved()){
        document.getElementById('save-button').firstChild.textContent = "СОХРАНЕНО";
    }
    else {
        document.getElementById('save-button').firstChild.textContent = "СОХРАНИТЬ";
    }
}

function changeListState(){
    if(isSaved()){
        removeListFromSaved(function(){
            location.reload();
        });
    }
    else{
        saveList(function(){
            location.reload();
        });
    }
}

function isSaved(){
    let list = channel._saved_lists.find(function(element){
        return element._id == listid;
    });

    if(list)
        return true;
    else
        return false;
}