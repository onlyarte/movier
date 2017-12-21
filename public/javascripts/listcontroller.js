function l_save(elem, listId) {
    sendReq(
        `/list/${listId}/save/`,
        (success) => {
            if (!success) {
                return console.log(`failed to save ${listId}`);
            }

            console.log(`saved ${listId}`);
            elem.setAttribute(
                'onClick', 
                `l_unsave(this, '${listId}')`,
            );
            elem.textContent = 'UNSAVE';
        },
    );
}

function l_unsave(elem, listId) {
    sendReq(
        `/list/${listId}/unsave/`,
        (success) => {
            if (!success) {
                return console.log(`failed to unsave ${listId}`);
            }

            console.log(`unsaved ${listId}`);
            elem.setAttribute(
                'onClick', 
                `l_save(this, '{listId}')`,
            );
            elem.textContent = 'SAVE';
        },
    );
}

function sendReq(req, callback) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open('POST', req, true);
    xhr.send();

    console.log(xhr.status);

    xhr.onload = () => {
        callback(true);
    }
    
    xhr.onerror = () => {
        callback(false);
    }
}