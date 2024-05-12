function savePost(event, index) {
  event.preventDefault();
  axios
    .post(`/save/${index}`)
    .then((response) => {
      // Check if the save was successful
      if (response.data.saved) {
        alert("Post saved successfully!"); // Display alert
        // Optional: Toggle the save button appearance
        const saveButton = document.querySelector(
          `.save-form[data-index="${index}"] .save-btn i`
        );
        if (saveButton) {
          saveButton.classList.toggle("far");
        }
      } else {
        alert("Failed to save post."); // Display alert for failure
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error saving post:", error);
      alert("An error occurred while saving the post."); // Display alert for error
    });
}
function savePost1(event, index) {
  window.location.reload();
  axios
    .post(`/save/${index}`)
    .then((response) => {
      if (response.data.saved) {
        // Update UI using response.data.savedItems
        renderSavedItems(response.data.savedItems); // Assuming you have a function to render saved items
        alert("Post saved successfully!"); // Display alert
      } else {
        // Handle error
        alert("Failed to save post."); // Display alert for failure
      }
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error saving post:", error);
      // Handle error
      alert("An error occurred while saving the post."); // Display alert for error
    });
}
