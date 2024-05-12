import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const deleteComment = (sharedItems, updateItemsJSON) => {
  router.post("/:index", (req, res) => {
    const index = req.params.index;

    if (index >= 0 && index < sharedItems.length) {
      // Delete the selected post's image file from the uploads folder
      const item = sharedItems[index];
      const imagePath = path.join(process.cwd(), "public", item.image);
      fs.unlinkSync(imagePath);

      // Remove the item from sharedItems array
      sharedItems.splice(index, 1);

      // Update IDs of the remaining items
      for (let i = 0; i < sharedItems.length; i++) {
        sharedItems[i].id = i;
      }

      // Update items.json file content
      updateItemsJSON(sharedItems);

      // Remove the deleted item from saved-items.json using its id
      const deletedItemId = item.id;
      const savedItems = JSON.parse(
        fs.readFileSync("saved-items.json", "utf-8")
      );
      const updatedSavedItems = savedItems.filter(
        (savedItem) => savedItem.id !== deletedItemId
      );

      // Update IDs of the remaining saved items
      for (let i = 0; i < updatedSavedItems.length; i++) {
        updatedSavedItems[i].id = i;
      }

      fs.writeFileSync(
        "saved-items.json",
        JSON.stringify(updatedSavedItems, null, 2),
        "utf-8"
      );

      // Redirect with success message to delete the selected post
      res.redirect("/?message=Post%20deleted%20successfully&type=error");
    } else {
      // Redirect with error messagey

      res.redirect("/?message=Failed%20to%20delete%20post&type=error");
    }
  });

  return router;
};

export default deleteComment;
