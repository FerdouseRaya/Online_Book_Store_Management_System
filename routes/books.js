const express = require("express");
const routes = express();
const bookController = require("../controller/booksController");
const { bookValidator } = require("../middleware/validation");
const { isAdmin } = require("../middleware/authentication_authorization");

routes.post("/create", isAdmin, bookValidator.create, bookController.create);
routes.get("/view", bookController.viewall);
routes.get(
  "/viewBySearch",
  bookValidator.viewBySearch,
  bookController.viewBySearch
);
routes.delete("/deleteBooks", bookController.deleteBooks);
module.exports = routes;
