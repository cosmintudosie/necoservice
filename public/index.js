`use strict`;

///////////------------- NAVIGATION BUTTON---------------
const navBar= document.querySelector(".nav-bar")
const btnNav = document.querySelector(".btn-nav");
const btnOff = document.querySelector(".icon-nav[name=close-outline]");
const btnOn = document.querySelector(".icon-nav[name=menu-outline]");
btnNav.addEventListener("click", () => {
  navBar.classList.toggle("open-nav");
});
document.addEventListener("click", function (e) {
  let openedList = document.querySelector(".open-nav .links");

  if (
    openedList &&
    !openedList.contains(e.target) &&
    !navBar.contains(e.target) &&
    navBar.classList.contains("open-nav")
  ) {
    navBar.classList.remove("open-nav");
  }
});
/////////SCROLL
let toScroll=document.querySelectorAll(".scroll")
const elementInView = (el) => {
  // const elementTop = el.getBoundingClientRect().top
return (
  el.getBoundingClientRect().top <= (window.innerHeight || document.documentElement.clientHeight)
  );
};

// const displayScrollElement = (element) => {
//   element.classList.add("scrolled");
//   // element.classList.remove("x");
// };
// const hideScrollElement = (element) => {
//   element.classList.remove("scrolled");
//   // element.classList.add("x");
// };
const handleScrollAnimation = () => {
  toScroll.forEach((el) => {
    if (el.getBoundingClientRect().top <= (window.innerHeight || document.documentElement.clientHeight)) {
      el.classList.add("scrolled");
      // displayScrollElement(el);
      // if (valueDisplays[0].textContent == "0") increasePercentage();
    }
    //  else {
    //   hideScrollElement(el);
    // }
  });
};

window.addEventListener("scroll", () => {
  handleScrollAnimation();
});
