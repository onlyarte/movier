function f_add(elem, filmId, listId) {
    sendReq(
        `/film/${filmId}/tolist/${listId}`,
        (success) => {
            if (!success) {
                return console.log(`failed to add ${filmId} to ${listId}`);
            }
            console.log(`added ${filmId} to ${listId}`);
            elem.setAttribute(
                'onClick', 
                `f_remove(this, '${filmId}', '${listId}')`,
            );
            elem.style.opacity = 0.7;
        },
    );
}

function f_remove(elem, filmId, listId) {
    sendReq(
        `/film/${filmId}/fromlist/${listId}`,
        (success) => {
            if (!success) {
                return console.log(`failed to remove ${filmId} from ${listId}`);
            }

            console.log(`removed ${filmId} from ${listId}`);
            elem.setAttribute(
                'onClick', 
                `f_add(this, '${filmId}', '${listId}')`,
            );
            elem.style.opacity = 0.5;
        },
    );
}