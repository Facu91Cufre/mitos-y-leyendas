const body = document.querySelector("body");
const filter = document.getElementById("cont-btns");
const filterBtns = filter.querySelectorAll(".btn");
const cardsContainer = document.getElementById("cards-container");
const editionContainer = document.querySelector(".edition-btns");
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
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const costDropdown = document.getElementById("cost-dropdown");
const strDropdown = document.getElementById("strength-dropdown");

let cards;
let filteredCards = [];
let currentPage = 1;
const itemsPerPage = 20;
let totalPages = 0;
let currentIndex = 0;
let modalIsOpen = false;
let modalCard;

// Fetch Cards

const fetchCards = async (fileName) => {
  try {
    const response = await fetch(`json/${fileName}.json`);
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
    card.dataset.id = item.id;
    cardsContainer.appendChild(card);
    card.addEventListener("click", () => {
      openModal(card);
      currentIndex = filteredCards.findIndex((c) => c.image === item.image);
    });
    modalBtn.addEventListener("click", () => {
      closeModal();
    });
  });
};

// Generate Pages Function

const generatePage = (set) => {
  totalPages = Math.ceil(set.length / itemsPerPage);
};

// Filter Cards Function

const filterCards = () => {
  const selectedCost = costDropdown.value;
  const selectedStr = strDropdown.value;
  console.log(selectedCost);
  const filteredArray = filteredCards.filter((item) => {
    return (
      (selectedCost == "" || item.cost == selectedCost) &&
      (selectedStr == "" || item.strength == selectedStr)
    );
  });
  showCards(filteredArray, currentPage);
};

// Open Modal Function

const openModal = (item) => {
  modalIsOpen = true;
  modalImageContainer.innerHTML = "";
  const image = item.querySelector("img");
  const arrowLeft = document.createElement("button");
  arrowLeft.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`;
  arrowLeft.classList.add("arrow", "arrow-left");
  const arrowRight = document.createElement("button");
  arrowRight.innerHTML = `<i class="fa-solid fa-arrow-right"></i>`;
  arrowRight.classList.add("arrow", "arrow-right");
  modalCard = document.createElement("img");
  modalCard.classList.add("modal-img");
  modalCard.classList.remove("image");
  modalCard.src = image.src;
  modalImageContainer.appendChild(modalCard);
  modalImageContainer.appendChild(arrowLeft);
  modalImageContainer.appendChild(arrowRight);
  modalOverlay.style.display = "block";
  arrowRight.addEventListener("click", () => {
    if (currentIndex < filteredCards.length - 1) {
      currentIndex++;
      updateImage(modalCard);
    }
  });
  arrowLeft.addEventListener("click", () => {
    if (currentIndex > 1) {
      currentIndex--;
      updateImage(modalCard);
    }
  });
};

const closeModal = () => {
  modalOverlay.style.display = "none";
  modalIsOpen = false;
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

// Update Card Image

const updateImage = (card) => {
  card.src = filteredCards[currentIndex].image;
};
// Search Button from Input

searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    const result = findCard(searchTerm);
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

// Previous and Next Buttons

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showCards(filteredCards, currentPage);
  }
});
nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    showCards(filteredCards, currentPage);
  }
});

// Mobile Header Icon

barIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-links");
});

document.addEventListener("keydown", (e) => {
  if (!modalIsOpen) {
    switch (e.key) {
      case "ArrowLeft":
        if (currentPage > 1) {
          currentPage--;
          showCards(filteredCards, currentPage);
        }
        break;
      case "ArrowRight":
        if (currentPage < totalPages) {
          currentPage++;
          showCards(filteredCards, currentPage);
        }
        break;
    }
  } else {
    switch (e.key) {
      case "ArrowLeft":
        if (currentIndex > 1) {
          currentIndex--;
          updateImage(modalCard);
        }
        break;
      case "ArrowRight":
        if (currentIndex < filteredCards.length - 1) {
          currentIndex++;
          updateImage(modalCard);
        }
        break;

      case "Escape":
        modalOverlay.style.display = "none";
      default:
        break;
    }
  }
});

editionContainer.addEventListener("click", (e) => {
  const edition = e.target.dataset.id;
  fetchCards(edition);
});

window.addEventListener("DOMContentLoaded", fetchCards("espada"));

costDropdown.addEventListener("change", filterCards);
strDropdown.addEventListener("change", filterCards);