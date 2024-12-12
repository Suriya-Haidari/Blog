import express from "express";
import fs from "fs";
import { timeDifference } from "./timeUtils.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const mainRouter = (sharedItems) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    const stories = JSON.parse(fs.readFileSync("story.json", "utf-8"));

    if (req.xhr) {
      res.render("partials/index-content", {
        stories: stories,
        items: sharedItems,
        timeDifference: timeDifference,
      });
    } else {
      res.render("index", {
        stories: stories,
        items: sharedItems,
        timeDifference: timeDifference,
      });
    }
  });

  router.post("/save/:index", (req, res) => {
    const index = req.params.index;
    const items = JSON.parse(fs.readFileSync("items.json", "utf-8"));
    let savedItems = JSON.parse(fs.readFileSync("saved-items.json", "utf-8"));

    if (items[index]) {
      const selectedItem = items[index];

      // Check if the post is already saved
      const alreadySaved = savedItems.some((item) => item.index === index);
      if (!alreadySaved) {
        savedItems.push({ index, ...selectedItem }); // Add the post to saved items
        fs.writeFileSync(
          "saved-items.json",
          JSON.stringify(savedItems, null, 2),
          "utf-8"
        );
      }
      res.json({ saved: true, savedItems: savedItems });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  router.get("/saved-items", (req, res) => {
    try {
      // Read the saved items data from the saved-items.json file
      const savedItems = JSON.parse(
        fs.readFileSync("saved-items.json", "utf-8")
      );

      // Render the saved-items.ejs file and pass the saved items data to it
      res.render("saved-items", { savedItems: savedItems });
    } catch (error) {
      console.error("Error reading saved items:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  router.post("/like/:index", (req, res) => {
    const index = req.params.index;
    let items = JSON.parse(fs.readFileSync("items.json", "utf-8"));
    let savedItems = JSON.parse(fs.readFileSync("saved-items.json", "utf-8"));

    if (items[index]) {
      items[index].liked = !items[index].liked;
      items[index].likes = items[index].likes || 0; // Initialize likes if not exist
      if (items[index].liked) {
        items[index].likes++;
      } else {
        items[index].likes--;
      }
      fs.writeFileSync("items.json", JSON.stringify(items, null, 2), "utf-8");

      // Update liked status and likes count in savedItems as well
      const savedItemIndex = savedItems.findIndex(
        (item) => item.id === items[index].id
      );
      if (savedItemIndex !== -1) {
        savedItems[savedItemIndex].liked = items[index].liked;
        savedItems[savedItemIndex].likes = items[index].likes;
        fs.writeFileSync(
          "saved-items.json",
          JSON.stringify(savedItems, null, 2),
          "utf-8"
        );
      }
      res.json({ liked: items[index].liked, likes: items[index].likes });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });

  router.post("/comment/:index", (req, res) => {
    const index = req.params.index;
    const comment = req.body.comment;

    try {
      let items = JSON.parse(fs.readFileSync("items.json", "utf8"));
      let savedItems = JSON.parse(fs.readFileSync("saved-items.json", "utf-8"));

      if (items[index] && savedItems[index]) {
        if (!items[index].comments || !Array.isArray(items[index].comments)) {
          items[index].comments = [];
        }
        if (
          !savedItems[index].comments ||
          !Array.isArray(savedItems[index].comments)
        ) {
          savedItems[index].comments = [];
        }

        items[index].comments.push(comment);
        savedItems[index].comments.push(comment);

        fs.writeFileSync("items.json", JSON.stringify(items, null, 2), "utf-8");
        fs.writeFileSync(
          "saved-items.json",
          JSON.stringify(savedItems, null, 2),
          "utf-8"
        );

        res.redirect("/");
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post("/comment/delete/:itemIndex/:commentIndex", (req, res) => {
    try {
      const { itemIndex, commentIndex } = req.params;

      // Read the items data from the JSON files
      let items = JSON.parse(fs.readFileSync("items.json", "utf-8"));
      let savedItems = JSON.parse(fs.readFileSync("saved-items.json", "utf-8"));

      // Check if the itemIndex and commentIndex are valid
      if (
        itemIndex >= 0 &&
        itemIndex < items.length &&
        commentIndex >= 0 &&
        commentIndex < items[itemIndex].comments.length
      ) {
        // Remove the comment at the specified indexes from items
        items[itemIndex].comments.splice(commentIndex, 1);

        // Remove the comment at the specified indexes from savedItems
        const savedItemIndex = savedItems.findIndex(
          (item) => item.index === itemIndex
        );
        if (savedItemIndex !== -1) {
          savedItems[savedItemIndex].comments = items[itemIndex].comments;
          fs.writeFileSync(
            "saved-items.json",
            JSON.stringify(savedItems, null, 2),
            "utf-8"
          );
        }

        // Write the updated items data back to the JSON file
        fs.writeFileSync("items.json", JSON.stringify(items, null, 2), "utf-8");

        res.redirect("/");
        window.location.reload();
      } else {
        // Invalid indexes, return a 404 Not Found status
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error) {
      // Internal server error, return a 500 status
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/items", (req, res) => {
    // Read the stories from the JSON file
    const stories = JSON.parse(fs.readFileSync("story.json", "utf-8"));

    // Render only the content section for the "/items" route
    res.render("partials/index-content", {
      stories: stories,
      items: sharedItems,
      timeDifference: timeDifference,
    });
  });

  router.get("/new", (req, res) => {
    res.render("story-form");
  });

  router.get("/newItem", (req, res) => {
    res.render("new-post");
  });

  router.get("/search", (req, res) => {
    res.render("search");
  });

  return router;
};

export default mainRouter;
