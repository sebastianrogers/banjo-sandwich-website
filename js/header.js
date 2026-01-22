// Function to load header
function loadHeader() {
  fetch("/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
    })
    .catch((error) => {
      console.error("Error loading header:", error);
    });
}

// Load header when DOM is ready
document.addEventListener("DOMContentLoaded", loadHeader);
