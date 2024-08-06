const filterBtns = document.getElementById("cont-btns");
const cardsContainer = document.getElementById("cards-container");
const pageBtns = document.getElementById("cont-btns-pages");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.getElementById("search-input");
const nuevoDiv = document.querySelector(".nuevo-div");
const barIcon = document.getElementById("bar-icon");
const navLinks = document.querySelector(".nav-links");

let cards;
let filteredCards = [];
let currentPage = 1;
const itemsPerPage = 20;

const fetchCards = async () => {
  try {
    const response = await fetch("cards.json");
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
  });
};

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

const findCard = (name) => {
  searchInput.value = "";
  return cards.find((card) => card.name.toLowerCase() === name.toLowerCase());
};

filterBtns.addEventListener("click", (e) => {
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
    } else {
      alert("Carta no encontrada");
    }
  } else {
    filteredCards = [...cards];
    showCards(filteredCards, currentPage);
    generatePage(filteredCards);
  }
});

barIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-links");
})

window.addEventListener("DOMContentLoaded", fetchCards);
