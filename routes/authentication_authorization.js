const express = require("express");
const routes = express();
const authController = require("../controller/authentication_authorization");
const { isAuthorized } = require("../middleware/authentication_authorization");
//const { authValidator } = require("../middleware/validation");

routes.post("/login", authController.login);
routes.post("/sign-up", isAuthorized, authController.signup);

module.exports = routes;
