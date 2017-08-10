function openNav() {
    document.getElementById('menu').style.visibility = 'visible';
    document.getElementById('menu').style.opacity = 1;
}

function closeNav() {
    document.getElementById('menu').style.opacity = 0;
    setTimeout(function(){
        document.getElementById('menu').style.visibility = 'hidden';
    }, 1000);
}
