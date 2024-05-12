document.addEventListener("DOMContentLoaded", function () {
  const commentBtns = document.querySelectorAll(".comment-btn");
  commentBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const commentsContainer = btn.nextElementSibling;
      commentsContainer.style.display = "block";
    });
  });

  const commentForms = document.querySelectorAll(".comment-form");
  commentForms.forEach((form) => {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const commentInput = form.querySelector(".comment-input");
      const commentText = commentInput.value.trim();
      const postIndex = form.dataset.index;
      if (commentText === "") {
        alert("Please enter a comment.");
        return;
      }
      try {
        const response = await fetch(`/comment/${postIndex}`, {
          // Use the correct URL format
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: commentText }),
        });

        if (response.ok) {
          const commentItem = document.createElement("div");
          commentItem.classList.add("comment-item");
          commentItem.textContent = commentText;
          const commentsList = form.nextElementSibling;
          commentsList.appendChild(commentItem);
          commentInput.value = "";
        } else {
          alert("Failed to add comment. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
document.querySelectorAll(".delete-comment").forEach((button) => {
  button.addEventListener("click", async () => {
    const itemIndex = button.getAttribute("data-item");
    const commentIndex = button.getAttribute("data-comment");
    const confirmDelete = confirm(
      "Are you sure you want to delete this comment?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `/comment/delete/${itemIndex}/${commentIndex}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          // Handle success: Remove the comment element from the DOM
          button.parentElement.remove();
          // Optionally, you can display a notification or update the UI
        } else {
          // Handle error response
          console.error("Failed to delete comment:", response.statusText);
          // Optionally, you can display an error message or handle the error
        }
      } catch (error) {
        // Handle network error or other issues
        console.error("Error deleting comment:", error.message);
        // Optionally, you can display an error message or handle the error
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteCommentForms = document.querySelectorAll(".delete-comment-form");

  deleteCommentForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior

      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle the successful deletion silently
        const parentCommentItem = form.closest(".comment-item");
        parentCommentItem.remove(); // Remove the deleted comment from the DOM
      } else {
        // Handle the deletion failure if needed
        console.error("Failed to delete comment");
      }
    });
  });
});
