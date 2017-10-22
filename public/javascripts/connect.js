//req is a url containing parameters
function sendUpdateRequest(req, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', req);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        console.log('req ' + req + ' processed');
        callback();
    };
    xhr.send();
}