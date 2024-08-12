const body = document.querySelector("body");
const filter = document.getElementById("cont-btns");
const filterBtns = filter.querySelectorAll(".btn");
const cardsContainer = document.getElementById("cards-container");
const pageBtns = document.getElementById("cont-btns-pages");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.getElementById("search-input");
const nuevoDiv = document.querySelector(".nuevo-div");
const barIcon = document.getElementById("bar-icon");
const navLinks = document.querySelector(".nav-links");
const modalOverlay = document.getElementById("modal-overlay");
const modalContainer = document.getElementById("modal-container");
const modalImageContainer = document.querySelector(".modal-image-container");
const modalBtn = document.querySelector(".modal-btn");
console.log(filterBtns);
let cards;
let filteredCards = [];
let currentPage = 1;
const itemsPerPage = 20;

// Fetch Cards

const fetchCards = async () => {
  try {
    const response = await fetch("daana.json");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    cards = await response.json();
    filteredCards = [...cards];
    showCards(filteredCards, currentPage);
    generatePage(filteredCards);
  } catch (error) {
    console.log("Fetch error: ", error);
  }
};

// Show Cards Function

const showCards = (set, page) => {
  cardsContainer.innerHTML = "";
  let start = (page - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  const slicedSet = set.slice(start, end);
  slicedSet.forEach((item) => {
    const card = document.createElement("div");
    card.innerHTML = `<img class="image" src="${item.image}">`;
    card.classList.add("image");
    cardsContainer.appendChild(card);
    card.addEventListener("click", () => {
      openModal(card);
    });
    modalBtn.addEventListener("click", () => {
      modalOverlay.style.display = "none";
    });
  });
};

// Generate Pages Function

const generatePage = (set) => {
  pageBtns.innerHTML = "";
  let totalPages = Math.ceil(set.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("page-button");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      showCards(set, currentPage);
    });
    pageBtns.appendChild(btn);
  }
};

// Open Modal Function

const openModal = (item) => {
  modalImageContainer.innerHTML = "";
  const image = item.querySelector("img");
  const modalCard = document.createElement("img");
  modalCard.classList.add("modal-img");
  modalCard.classList.remove("image");
  modalCard.src = image.src;
  modalImageContainer.appendChild(modalCard);
  modalOverlay.style.display = "block";
};

// Find Card Function

const findCard = (name) => {
  searchInput.value = "";
  return cards.find((card) => card.name.toLowerCase() === name.toLowerCase());
};

// Filter Cards by Type

filterBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    cardsContainer.innerHTML = "";
    currentPage = 1;
    const category = e.target.dataset.id;
    filteredCards = cards.filter((card) => {
      if (category === "Todas") {
        return true;
      }
      return category === card.type;
    });
    showCards(filteredCards, currentPage);
    generatePage(filteredCards);
  });
});

// Search Button from Input

searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    const result = findCard(searchTerm);
    pageBtns.innerHTML = "";
    cardsContainer.innerHTML = "";
    if (result) {
      const cardDiv = document.createElement("div");
      cardDiv.innerHTML = `<img class="image" src="${result.image}">`;
      cardsContainer.appendChild(cardDiv);
      cardDiv.addEventListener("click", () => {
        openModal(cardDiv);
      });
    } else {
      alert("Carta no encontrada");
    }
  } else {
    filteredCards = [...cards];
    showCards(filteredCards, currentPage);
    generatePage(filteredCards);
  }
});

// Mobile Header Icon

barIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-links");
});

document.addEventListener("keydown", (e) => {
  const lastPage = Number(pageBtns.lastChild.innerText);
  switch (e.key) {
    case "ArrowLeft":
      if (currentPage > 1) {
        currentPage--;
        showCards(filteredCards, currentPage);
      }
      break;
    case "ArrowRight":
      if (currentPage < lastPage) {
        currentPage++;
        showCards(filteredCards, currentPage);
      }
      break;
    case "Escape":
      modalOverlay.style.display = "none";
    default:
      break;
  }
});

window.addEventListener("DOMContentLoaded", fetchCards);
