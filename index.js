import express from "express";
import bodyParser from "body-parser";
import mainRouter from "./router/mainRouter.js";
import methodOverride from "method-override";
import deleteRouter from "./router/deleteRouter.js";
import submitRouter from "./router/submitRouter.js";
import editRouter from "./router/editRouter.js";
import storyRouter from "./router/storyRouter.js";
import cors from "cors";
import fs from "fs";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// Read items data from the items.json file
const items = JSON.parse(fs.readFileSync("items.json", "utf-8"));
let lastItemId = items.length > 0 ? items[items.length - 1].id : -1;

const generateItemId = () => {
  lastItemId++;
  return lastItemId;
};
app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.items = items;
  next();
});

// Write items data to the JSON file whenever items are added or removed
const updateItemsJSON = (sharedItems) => {
  fs.writeFileSync("items.json", JSON.stringify(sharedItems, null, 2), "utf-8");
};

// Create a copy of the initial items array to make some behavior of the website
const sharedItems = items.slice();

app.use("/", mainRouter(sharedItems, generateItemId));
app.use("/delete", deleteRouter(sharedItems, updateItemsJSON));
app.use("/submit", submitRouter(updateItemsJSON, sharedItems, generateItemId));
app.use("/edit", editRouter(sharedItems, updateItemsJSON));
app.use("/", storyRouter);

app.use((req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Application started on port: ${PORT}`);
});
