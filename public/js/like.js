const likeButtons = document.querySelectorAll(".like-btn");

likeButtons.forEach((button) => {
  button.addEventListener("click", async function () {
    // Disable button to prevent multiple clicks
    button.disabled = true;

    const index = button.getAttribute("data-index");

    try {
      const response = await fetch(`/like/${index}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like/unlike the post");
      }

      const data = await response.json();

      // Update the like count
      const likeCountElement = button.nextElementSibling;
      likeCountElement.textContent = data.likes;

      // Toggle the like button's appearance and style
      if (data.liked) {
        button.classList.add("liked");
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.backgroundColor = "red";
      } else {
        button.classList.remove("liked");
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.style.backgroundColor = "";
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      // Re-enable the button
      button.disabled = false;
    }
  });
});
