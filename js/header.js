// Function to load header
function loadHeader() {
  fetch("/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
      initHamburgerMenu();
    })
    .catch((error) => {
      console.error("Error loading header:", error);
    });
}

// Set up hamburger toggle
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a nav link is clicked
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
}

// Load header when DOM is ready
document.addEventListener("DOMContentLoaded", loadHeader);
