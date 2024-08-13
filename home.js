const barIcon = document.getElementById("bar-icon");
const navLinks = document.querySelector(".nav-links");

barIcon.addEventListener("click", () => {
    navLinks.classList.toggle("show-links");
  });