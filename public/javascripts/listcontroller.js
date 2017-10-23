let l_displayedF = 0;

function l_save(listid, callback){
    sendUpdateRequest('/list/' + listid + '/save/', callback);
}

function l_unsave(listid, callback){
    sendUpdateRequest('/list/' + listid + '/remove/', callback);
}

function l_updateSB(listid){
    if(l_isSaved(listid)){
        document.getElementById('save-button').firstChild.textContent = "СОХРАНЕНО";
    }
    else {
        document.getElementById('save-button').firstChild.textContent = "СОХРАНИТЬ";
    }
}

function l_clickedSB(listid){
    if(l_isSaved(listid)){
        l_unsave(function(){
            location.reload();
        });
    }
    else{
        l_save(function(){
            location.reload();
        });
    }
}

function l_isSaved(listid){
    let list = channel._saved_lists.find(function(element){
        return element._id == listid;
    });

    if(list)
        return true;
    else
        return false;
}