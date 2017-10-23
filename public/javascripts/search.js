function search(){
    let q = document.getElementById("search-box").value;
    if(!q)
        return;
    
    let old_results = document.getElementById("search-results").getElementsByClassName("menu-item");
    for(let i = 0; i < old_results.length; i++){
        document.getElementById("search-results").removeChild(old_results[i]);
    }

    let url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyAUFee7uVwzoxE8JbWu6mPXJmtyXjE6beo&cx=015865584787196170358:edihmyabb88&q=' + q;
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.responseText);
            let res = JSON.parse(xmlHttp.responseText);
            for(let i = 0; i < res.items.length && i < 5; i++){
                let id = res.items[i].link.split("-").pop().slice(0,-1) || null;
                let title = res.items[i].pagemap.movie[0].name || null;
                if(!id || !title){
                    i--;
                    continue;
                }
                let res_item = document.createElement("a");
                res_item.href = "/film/" + id;
                res_item.className = "menu-item";
                let item_icon = document.createElement("img");
                item_icon.src = "/images/icons/list.png";
                let item_title = document.createElement("span");
                item_title.textContent = title;
                res_item.appendChild(item_icon);
                res_item.appendChild(item_title);
                document.getElementById("search-results").appendChild(res_item);
            }
            document.getElementById("search-results").style.display = "block";
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}