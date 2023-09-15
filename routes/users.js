const express = require("express");
const routes = express();
const userController = require("../controller/usersController");
const { userValidator } = require("../middleware/validation");

routes.post("/create", userValidator.create, userController.create);

module.exports = routes;
