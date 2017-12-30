function openNav() {
  document.getElementById('menu-open').style.display = 'none';
  document.getElementById('menu-overlay').style.visibility = 'visible';
}

function closeNav() {
  document.getElementById('menu-overlay').style.visibility = 'hidden';
  document.getElementById('menu-open').style.display = 'block';
}
