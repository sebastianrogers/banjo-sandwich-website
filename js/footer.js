// Function to load footer
function loadFooter() {
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
      // Set the copyright year after the footer is loaded
      document.getElementById("copyright-year").textContent =
        new Date().getFullYear();
    })
    .catch((error) => {
      console.error("Error loading footer:", error);
    });
}

// Load footer when DOM is ready
document.addEventListener("DOMContentLoaded", loadFooter);
