function loadPage(url, containerId) {
  axios
    .get(url)
    .then((response) => {
      document.getElementById(containerId).innerHTML = response.data;
    })
    .catch((error) => console.error("Error:", error));
}

function deleteItem(event) {
  event.preventDefault();
  const form = event.target;
  const url = form.getAttribute("action"); // Get the form action URL
  const containerId = form.getAttribute("data-container"); // Get the container ID
  axios
    .post(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(() => loadPage(url, containerId)) // Reload the page content after deleting
    .catch((error) => console.error("Error:", error));
}

function editItem(event) {
  event.preventDefault();
  const form = event.target;
  const url = form.getAttribute("action");
  const containerId = "content";
  loadPage(url, containerId);
}

// Event listener for navigation links
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a[data-ajax]");
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const url = this.getAttribute("href");
      const containerId = this.getAttribute("data-container");
      loadPage(url, containerId);
    });
  });
});
