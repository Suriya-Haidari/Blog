document.addEventListener("DOMContentLoaded", function () {
  const toggleIconsBtnMobile = document.getElementById("toggleIconsBtnMobile");
  const navbarModal = document.getElementById("navbarModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const links = document.querySelectorAll(".icons a");

  // Function to update the active link
  function setActiveLink() {
    const currentPath = window.location.pathname; // Get the current path
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active"); // Add active class to the matching link
      } else {
        link.classList.remove("active"); // Remove active class from others
      }
    });
  }

  // Call the function on page load
  setActiveLink();

  // Show the modal when toggle button is clicked
  toggleIconsBtnMobile.addEventListener("click", function () {
    navbarModal.style.display = "block"; // Show the modal
  });

  // Hide the modal when close button is clicked
  closeModalBtn.addEventListener("click", function () {
    navbarModal.style.display = "none"; // Hide the modal
  });

  // Update active link when a navbar link is clicked (useful for single-page apps)
  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((l) => l.classList.remove("active")); // Remove active class
      this.classList.add("active"); // Add active class to clicked link
    });
  });
});
