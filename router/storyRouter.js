import express from "express";
import fs from "fs";
import { join } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
import multer from "multer";
const uploadDir = join(__dirname, "../public/storyUploads");

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
// Middleware for overriding the method
router.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
});

const upload = multer({ storage: storage });

router.post("/newstory", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    const timestamp = Date.now(); // Get current timestamp
    const id = `story_${timestamp}`; // Use timestamp as part of the ID

    const newStory = {
      timestamp: timestamp,
      id: id, // Use the combined ID
      content: req.body.content,
      image: req.file.filename,
    };

    const storyFilePath = path.join(__dirname, "../story.json");

    // Check if file exists before reading
    if (!fs.existsSync(storyFilePath)) {
      fs.writeFileSync(storyFilePath, "[]"); // Create file if it doesn't exist
    }

    const data = await fs.promises.readFile(storyFilePath, "utf8");
    const stories = JSON.parse(data);
    stories.push(newStory);
    await fs.promises.writeFile(
      storyFilePath,
      JSON.stringify(stories, null, 2)
    );
    res.redirect("/?message=Story%20created%20successfully&type=success");
  } catch (error) {
    console.error("Error creating new story:", error);
    res.status(500).send("Internal Server Error");
    res.redirect("/?message=Failed%20to%20delete%20story&type=error");
  }
});

router.delete("/deleteStory/:id", async (req, res) => {
  try {
    const storyId = req.params.id;
    const storyFilePath = path.join(__dirname, "../story.json");

    const data = await fs.promises.readFile(storyFilePath, "utf8");
    let stories = JSON.parse(data);

    // Find the story to be deleted
    const deletedStoryIndex = stories.findIndex(
      (story) => story.id === storyId
    );

    // Check if the story exists
    if (deletedStoryIndex === -1) {
      return res.status(404).send("Story not found");
    }

    // Delete the image file associated with the deleted story
    const deletedStory = stories[deletedStoryIndex];
    const imagePath = path.join(uploadDir, deletedStory.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove the story from the list
    stories.splice(deletedStoryIndex, 1);

    await fs.promises.writeFile(
      storyFilePath,
      JSON.stringify(stories, null, 2)
    );

    // Redirect with success message to delete the selected story
    res.redirect("/?message=Story%20deleted%20successfully&type=error");
  } catch (error) {
    console.error("Error deleting story:", error);
    res.redirect("/?message=Failed%20to%20delete%20story&type=error");
  }
});

router.get("/", async (req, res) => {
  try {
    const storyFilePath = path.join(__dirname, "../story.json");

    // Check if file exists before reading
    if (!fs.existsSync(storyFilePath)) {
      fs.writeFileSync(storyFilePath, "[]"); // Create file if it doesn't exist
    }

    const data = await fs.promises.readFile(storyFilePath, "utf8");
    const stories = JSON.parse(data);
    res.render("index", { stories });
  } catch (error) {
    console.error("Error reading stories:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
