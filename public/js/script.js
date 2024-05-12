function previewImage(event) {
  const preview = document.getElementById("image-preview");
  const fileInput = event.target;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function () {
      preview.src = reader.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    // Reset to default placeholder image if no file is selected
    preview.src = "/uploads/defaultImg.png";
  }
}

function previewImage2(event) {
  const preview = document.getElementById("image-preview2");
  const fileInput = event.target;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function () {
      preview.src = reader.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
}

function showNotification(message, color) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.display = "block";
  notification.style.backgroundColor = color;
  notification.style.color = "white";
  notification.style.padding = "10px";
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "9999";

  // Initial opacity
  notification.style.opacity = 0;

  document.body.appendChild(notification);

  // Fade in animation
  let opacity = 0;
  const fadeInInterval = setInterval(() => {
    opacity += 0.1;
    notification.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(fadeInInterval);

      // Fade out animation
      setTimeout(() => {
        const fadeOutInterval = setInterval(() => {
          opacity -= 0.1;
          notification.style.opacity = opacity;
          if (opacity <= 0) {
            clearInterval(fadeOutInterval);
            document.body.removeChild(notification);
          }
        }, 50);
      }, 3000);
    }
  }, 50);
}

// Check if there's a notification message in the URL
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
const type = urlParams.get("type");

if (message && type) {
  // Display notification based on type property
  showNotification(message, type === "success" ? "green" : "red");
}

// Function to toggle between light and dark themes
function toggleTheme(theme) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(theme);
}

// Event listeners for theme buttons
document.getElementById("lightThemeBtn").addEventListener("click", function () {
  toggleTheme("light-theme");
});

document.getElementById("darkThemeBtn").addEventListener("click", function () {
  toggleTheme("dark-theme");
});

let collapseTimeout;

function expandStory(story) {
  const stories = document.querySelectorAll(".story");
  stories.forEach((s) => {
    if (s !== story) {
      s.classList.remove("expanded");
    }
  });

  story.classList.toggle("expanded");

  // Close story if clicked outside
  document.addEventListener("click", function (event) {
    const stories = document.querySelectorAll(".story");
    stories.forEach((story) => {
      if (!story.contains(event.target)) {
        story.classList.remove("expanded");
      }
    });
  });

  // Get the progress bar and reset its width
  const progressBar = story.querySelector(".progress-bar");
  progressBar.style.width = "0%";

  // Collapse story after 5 seconds
  // Clear previous timeout
  clearTimeout(collapseTimeout);
  collapseTimeout = setTimeout(() => {
    story.classList.remove("expanded");
  }, 5000);

  // Expand story for 5 seconds
  if (story.classList.contains("expanded")) {
    let progress = 0;
    const interval = setInterval(() => {
      // Update progress every second
      progress += 100 / 5;
      progressBar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);

        // Reset progress bar
        progressBar.style.width = "0%";
        story.classList.remove("expanded");

        // Clear timeout if story collapsed manually
        clearTimeout(collapseTimeout);
      }
    }, 1000);
  }

  // Remove border from image when story is expanded
  const storyImage = story.querySelector(".story-image img");
  storyImage.style.borderColor = "transparent";
}

// Close story if clicked outside
document.addEventListener("click", function (event) {
  const stories = document.querySelectorAll(".story");
  stories.forEach((story) => {
    if (!story.contains(event.target)) {
      story.classList.remove("expanded");
      const progressBar = story.querySelector(".progress-bar");

      // Reset progress bar
      progressBar.style.width = "0%";
    }
  });
});

// Toggle border color class when story is clicked
function toggleBorderColor(story) {
  story.classList.toggle("no-border");
}

// Event listener for clicking on stories to toggle border color
document.addEventListener("click", function (event) {
  const clickedElement = event.target;
  const story = clickedElement.closest(".story");
  if (story) {
    toggleBorderColor(story);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const likeBtns = document.querySelectorAll(".like-btn");

  likeBtns.forEach((btn) => {
    btn.addEventListener("click", async function () {
      const index = btn.getAttribute("data-index");

      try {
        const response = await fetch(`/like/${index}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to like/unlike the post");
        }

        const data = await response.json();
        const icon = btn.querySelector("i");
        const likeCount = btn.nextElementSibling;

        if (data.liked) {
          btn.classList.add("liked");
          icon.classList.remove("far");
          icon.classList.add("fas");
        } else {
          btn.classList.remove("liked");
          icon.classList.remove("fas");
          icon.classList.add("far");
        }

        likeCount.textContent = data.likes;
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});

function handeSubmit() {
  window.location.reload();
}
