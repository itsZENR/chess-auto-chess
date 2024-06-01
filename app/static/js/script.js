// Экран загрузки
window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    loader.style.display = 'none'; // скрыть экран загрузки после загрузки страницы
});


document.addEventListener("DOMContentLoaded", function () {
  // [Burger]
  let burger = document.querySelector(".icon-menu");
  burger.addEventListener("click", function (e) {
    let burger_icon = document.querySelector(".icon-menu");
    let menu = document.querySelector(".header__menu");
    let lock = document.querySelector("body");

    burger_icon.classList.toggle("_active");
    menu.classList.toggle("_active");
    lock.classList.toggle("_lock");
  });
  // [/Burger]
    
});
