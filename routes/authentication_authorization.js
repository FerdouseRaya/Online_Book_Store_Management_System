const express = require("express");
const routes = express();
const authController = require("../controller/authentication_authorizationController");
const { authValidator } = require("../middleware/validation");

routes.post("/login", authController.login);
routes.post("/sign-up", authValidator.signup, authController.signup);

module.exports = routes;
