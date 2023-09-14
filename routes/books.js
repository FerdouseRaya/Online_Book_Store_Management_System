const express = require("express");
const routes = express();
const bookController = require("../controller/books");
const { bookValidator } = require("../middleware/validation");

routes.post("/create", bookValidator.create, bookController.create);

module.exports = routes;
