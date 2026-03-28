const burger = document.getElementById("burger");
const burgerClose = document.getElementById("burger-close");
const navMenu = document.getElementById("nav-menu");

burger.addEventListener("click", () => {
  navMenu.classList.add("open");
  navMenu.classList.remove("close");
});

burgerClose.addEventListener("click", () => {
  navMenu.classList.add("close");
});
