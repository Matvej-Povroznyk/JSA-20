import Handlebars from "handlebars";
import galleryCardTemplate from "bundle-text:../templates/image-card.hbs";

const searchForm = document.querySelector(`#search-form`);
const gallery = document.querySelector(`.gallery`);
const loadMoreBtn = document.querySelector(`.load-more`);

let currentQuery = "";
let currentPage;

const api_key = "39409700-74de25685e9a6a3e702d9f6e8";
const fetchImages = async function (query, page) {
  const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${encodeURIComponent(query)}&page=${page}&per_page=12&key=${api_key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

  const data = await res.json();
  return data.hits;
};

const renderGallery = function (images) {
  const galleryCard = Handlebars.compile(galleryCardTemplate);
  const markup = galleryCard(images);

  gallery.insertAdjacentHTML("beforeend", markup);
};

const handleSubmit = async function (e) {
  e.preventDefault();

  const currentTarget = e.currentTarget;
  const q = currentTarget.query.value.trim();

  if (!q) return;
  gallery.innerHTML = "";
  loadMoreBtn.style.display = "none";

  currentQuery = q;
  currentPage = 1;

  try {
    const images = await fetchImages(q, 1);
    renderGallery(images);
    loadMoreBtn.style.display = "block";
  } catch (e) {
    console.error(e);
  }
};

const handleLoadMore = async function () {
  currentPage += 1;

  try {
    const images = await fetchImages(currentQuery, currentPage);

    if (!images || images.length === 0) {
      loadMoreBtn.style.display = "none";
      return;
    }

    renderGallery(images);
    const lastCard = gallery.lastElementChild;
    setTimeout(() => {
      lastCard.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  } catch (err) {
    currentPage -= 1;
    console.error(err);
  }
};

searchForm.addEventListener(`submit`, handleSubmit);
loadMoreBtn.addEventListener(`click`, handleLoadMore);
