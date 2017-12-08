function f_add(event, filmId, listId) {
    const target = event.target;
    if (sendReq(`/film/${filmId}/tolist/${listId}`)) {
        console.log(`added ${filmId} to ${listId}`);
        target.setAttribute(
            'onClick', 
            `f_remove(this, ${filmId}, ${listId})`,
        );
        target.style.opacity = 0.7;
    } else {
        console.log(`failed to add ${filmId} to ${listId}`);
    }
}

function f_remove(event, filmId, listId) {
    const target = event.target;
    if (sendReq(`/film/${filmId}/fromlist/${listId}`)) {
        console.log(`removed ${filmId} from ${listId}`);
        target.setAttribute(
            'onClick', 
            `f_add(this, ${filmId}, ${listId})`,
        );
        target.style.opacity = 0.5;
    } else {
        console.log(`failed to remove ${filmId} from ${listId}`);
    }
}

function sendReq(req) {
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