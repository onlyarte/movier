function l_save(event, listId) {
    const target = event.target;
    if (sendReq(`/list/${listId}/save/`)) {
        console.log(`saved ${listId}`);
        target.setAttribute(
            'onClick', 
            `l_unsave(this, ${listId})`,
        );
        target.textContent = 'Unsave';
    } else {
        console.log(`failed to save ${listId}`);
    }
}

function l_unsave(event, listId) {
    const target = event.target;
    if (sendReq(`/film/${listId}/unsave/`)) {
        console.log(`unsaved ${listId}`);
        target.setAttribute(
            'onClick', 
            `l_save(this, ${listId})`,
        );
        target.textContent = 'Save';
    } else {
        console.log(`failed to unsave ${listId}`);
    }
}

function sendReq(req){
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.open('POST', req, true);
    xhr.send();

    if (xhr.status != 200) {
        return false;
    } else {
        return true;
    }
}