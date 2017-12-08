//req is a url containing parameters
function sendUpdateRequest(req, callback){
    const xhr = new XMLHttpRequest();

    xhr.open('POST', req, false);
    xhr.send();

    if (xhr.status != 200) {
        console.log("smth went wrong");
        return false;
    } else {
        console.log("okay");
        return true;
    }
}