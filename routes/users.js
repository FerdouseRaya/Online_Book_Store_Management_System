const express = require("express");
const routes = express();
const userController = require("../controller/usersController");
const { userValidator } = require("../middleware/validation");
const { isAdmin } = require("../middleware/authentication_authorization");

routes.post("/create", isAdmin, userValidator.create, userController.create);
routes.delete("/deleteuser", userController.deleteUser);
module.exports = routes;
