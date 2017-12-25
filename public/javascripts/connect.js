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