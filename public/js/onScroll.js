// Post scroll animation functionality
function animateOnScroll() {
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (itemTop < windowHeight) {
      if (!item.classList.contains("item-scroll")) {
        item.classList.add("item-scroll");
      }
    } else {
      item.classList.remove("item-scroll");
    }
  });
}

animateOnScroll();

window.addEventListener("scroll", animateOnScroll);
