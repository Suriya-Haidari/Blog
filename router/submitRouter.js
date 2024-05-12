import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import path from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, "../public/uploads");

// Create the uploads directory if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

const uploadImage = (file) => {
  const originalName = file.originalname;
  const fileName = path.parse(originalName).name;
  const fileExtension = path.parse(originalName).ext;

  let index = 0;
  let uniqueFileName = originalName;

  while (fs.existsSync(path.join(uploadDir, uniqueFileName))) {
    index++;
    uniqueFileName = `${fileName}_${index}${fileExtension}`;
  }

  return uniqueFileName;
};

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueFileName = uploadImage(file);
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

const submitRouter = (updateItemsJSON, sharedItems, generateItemId) => {
  router.get("/newItem", (req, res) => {
    res.render("new-post");
  });

  router.post("/submit", upload.single("image"), (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const createdTime = new Date(); // Get the current time

    const newItem = {
      id: generateItemId(),
      title,
      description,
      image,
      createdTime,
    };

    sharedItems.push(newItem);
    updateItemsJSON(sharedItems);

    // Check if the item was successfully added
    if (sharedItems.includes(newItem)) {
      // Redirect to the main page with success message and color
      res.redirect(`/?message=Post%20created%20successfully&type=success`);
    } else {
      // Redirect to the main page with error message and color
      res.redirect(`/?message=Failed%20to%20create%20post&typoe=error`);
    }
  });

  return router;
};
export default submitRouter;
