/* SevenMentor interactions: mobile menu, course filtering, story slider and form validation */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");
const courseSearch = document.getElementById("courseSearch");
const clearSearch = document.getElementById("clearSearch");
const categoryButtons = [...document.querySelectorAll(".category-button")];
const courseCards = [...document.querySelectorAll(".course-card")];
const courseCount = document.getElementById("courseCount");
const emptyState = document.getElementById("emptyState");
const storiesTrack = document.getElementById("storiesTrack");
const storyCards = [...document.querySelectorAll(".story-card")];
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const currentYear = document.getElementById("currentYear");

let selectedCategory = "all";
let storyIndex = 0;

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
dropdownToggle.addEventListener("click", () => {
  const open = dropdownMenu.classList.toggle("open");
  dropdownToggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", event => {
  if (!event.target.closest(".has-dropdown")) {
    dropdownMenu.classList.remove("open");
    dropdownToggle.setAttribute("aria-expanded", "false");
  }
  if (!event.target.closest(".site-header") && mainNav.classList.contains("open")) closeMenu();
});
mainNav.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", closeMenu));

function filterCourses() {
  const query = courseSearch.value.trim().toLowerCase();
  let count = 0;
  courseCards.forEach(card => {
    const categoryMatch = selectedCategory === "all" || card.dataset.category === selectedCategory;
    const text = `${card.dataset.title} ${card.textContent}`.toLowerCase();
    const queryMatch = text.includes(query);
    const show = categoryMatch && queryMatch;
    card.hidden = !show;
    if (show) count++;
  });
  emptyState.hidden = count > 0;
  courseCount.textContent = query ? `${count} course${count === 1 ? "" : "s"} found` : `${count} courses`;
}
function selectCategory(category) {
  selectedCategory = category;
  categoryButtons.forEach(button => button.classList.toggle("active", button.dataset.category === category));
  filterCourses();
}
categoryButtons.forEach(button => button.addEventListener("click", () => selectCategory(button.dataset.category)));
document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    const category = link.dataset.categoryLink;
    const map = {development:"development",data:"data",cloud:"cloud",security:"security",all:"all"};
    selectCategory(map[category] || "all");
    closeMenu();
  });
});
courseSearch.addEventListener("input", filterCourses);
clearSearch.addEventListener("click", () => {
  courseSearch.value = "";
  filterCourses();
  courseSearch.focus();
});

function visibleStoryCount() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 850) return 2;
  return 3;
}
function updateStories() {
  const visible = visibleStoryCount();
  const maxIndex = Math.max(0, storyCards.length - visible);
  storyIndex = Math.min(storyIndex, maxIndex);
  if (!storyCards.length) return;
  const style = getComputedStyle(storiesTrack);
  const gap = parseFloat(style.gap) || 0;
  const cardWidth = storyCards[0].getBoundingClientRect().width;
  storiesTrack.style.transform = `translateX(-${storyIndex * (cardWidth + gap)}px)`;
}
document.getElementById("storyPrev").addEventListener("click", () => {
  storyIndex = storyIndex <= 0 ? Math.max(0, storyCards.length - visibleStoryCount()) : storyIndex - 1;
  updateStories();
});
document.getElementById("storyNext").addEventListener("click", () => {
  const max = Math.max(0, storyCards.length - visibleStoryCount());
  storyIndex = storyIndex >= max ? 0 : storyIndex + 1;
  updateStories();
});
window.addEventListener("resize", updateStories);
window.addEventListener("load", updateStories);

window.addEventListener("scroll", () => backToTop.classList.toggle("visible", window.scrollY > 450));
backToTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
currentYear.textContent = new Date().getFullYear();

contactForm.addEventListener("submit", event => {
  event.preventDefault();
  formMessage.classList.remove("success");
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  const email = document.getElementById("email").value.trim();
  const branch = document.getElementById("branch").value;
  if (!name || !phone || !email || !branch) {
    formMessage.textContent = "Please complete all required fields.";
    return;
  }
  if (phone.length !== 10) {
    formMessage.textContent = "Please enter a valid 10-digit phone number.";
    document.getElementById("phone").focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    document.getElementById("email").focus();
    return;
  }
  formMessage.textContent = "Thank you! This demo form is validated, but no information has been sent.";
  formMessage.classList.add("success");
  contactForm.reset();
});
