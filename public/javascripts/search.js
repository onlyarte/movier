function search() {
  const old_results = document.getElementById('search-results');
  while (old_results.firstChild) {
    old_results.removeChild(old_results.firstChild);
  }

  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      const res = JSON.parse(xmlHttp.responseText);
      console.log(res);
      res.map((film) => {
        const res_item = document.createElement('a');
        res_item.href = `/film/${film.id}`;
        res_item.className = 'menu-item';
        const item_icon = document.createElement('img');
        item_icon.src = '/images/icons/popcorn.png';
        const item_title = document.createElement('span');
        item_title.textContent = film.title;
        res_item.appendChild(item_icon);
        res_item.appendChild(item_title);
        document.getElementById('search-results').appendChild(res_item);
        return 0;
      });
      document.getElementById('search-results').style.display = 'block';
    }
  };
  xmlHttp.open('GET', `/film/search/${encodeURI(document.getElementById('search-box').value)}`, true);
  xmlHttp.send();
}
