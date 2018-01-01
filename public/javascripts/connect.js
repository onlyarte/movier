function sendReq(req, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', req, true);
  xhr.send();

  xhr.onload = () => {
    callback(true);
  };

  xhr.onerror = () => {
    callback(false);
  };
}
