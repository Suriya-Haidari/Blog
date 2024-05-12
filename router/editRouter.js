import express from "express";
import multer from "multer";
import fs from "fs";
import { timeDifference } from "./timeUtils.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, "../public/uploads");

// Create the uploads directory if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const originalname = file.originalname;
    let fileName = originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const editRouter = (sharedItems, updateItemsJSON) => {
  const updateSavedItemsJSON = (itemId, updatedItem) => {
    try {
      const savedItems = JSON.parse(
        fs.readFileSync("saved-items.json", "utf-8")
      );

      // Find the index of the item to be updated in the saved-itemsjson file array
      const index = savedItems.findIndex((item) => item.id === itemId);

      if (index !== -1) {
        // Update the item in the saved items array
        savedItems[index] = { ...updatedItem };

        // Write the updated saved items array back to the file
        fs.writeFileSync(
          "saved-items.json",
          JSON.stringify(savedItems, null, 2),
          "utf-8"
        );
      } else {
        // If the item is not found in the saved items array, add it
        savedItems.push({ ...updatedItem });

        // Write the updated saved items array back to the file
        fs.writeFileSync(
          "saved-items.json",
          JSON.stringify(savedItems, null, 2),
          "utf-8"
        );
      }
    } catch (error) {
      console.error("Error updating saved items:", error);
    }
  };

  router.get("/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = sharedItems.find((item) => item.id === itemId);

    if (item) {
      res.render("edit", { item: item, timeDifference: timeDifference });
    } else {
      res.send("Cannot edit item");
    }
  });

  router.put("/:id", upload.single("image"), (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedImage = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.oldImage;

    const itemIndex = sharedItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      const item = sharedItems[itemIndex];
      item.title = updatedTitle;
      item.description = updatedDescription;
      item.image = updatedImage;

      // Update edited property and timestamp
      item.edited = true;
      item.lastEdited = new Date();

      // Update the created time as well
      item.createdTime = new Date();

      // Write the updated items to items.json
      updateItemsJSON(sharedItems);

      // Update saved-items.json file
      updateSavedItemsJSON(itemId, item);

      // Delete previous image if it's different from the new one
      if (req.body.oldImage && req.body.oldImage !== updatedImage) {
        const oldImagePath = join(__dirname, "../public", req.body.oldImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error removing old image:", err);
          } else {
            console.log("Old image removed successfully");
          }
        });
      }

      // Show notification with a success message
      res.redirect(`/?message=Post%20updated%20successfully&type=success`);
    } else {
      res.send("Cannot update item");
    }
  });

  router.patch("/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedFields = req.body;

    const itemIndex = sharedItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      const item = sharedItems[itemIndex];
      Object.assign(item, updatedFields);

      // Update edited property and timestamp
      item.edited = true;
      item.lastEdited = new Date();

      // Update the created time as well
      item.createdTime = new Date();

      // Write the updated items to items.json
      updateItemsJSON(sharedItems);

      // Update saved items JSON
      updateSavedItemsJSON(itemId, item);

      // Show success notification
      res.redirect(`/?message=Post%20updated%20successfully&type=success`);
    } else {
      res.send("Cannot update item");
    }
  });

  return router;
};

export default editRouter;
