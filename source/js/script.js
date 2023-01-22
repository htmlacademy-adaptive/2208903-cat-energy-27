let navMain = document.querySelector(".main-nav");
let navToggle = document.querySelector(".main-header__toggle");
let mainHeader = document.querySelector(".main-header__box");

navMain.classList.remove("main-nav--nojs");
mainHeader.classList.remove("main-header__box--nojs");

navToggle.addEventListener("click", function () {
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opened");
    navToggle.classList.add("main-header__toggle--switch");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opened");
    navToggle.classList.remove("main-header__toggle--switch");
  }
});
