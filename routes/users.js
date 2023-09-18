const express = require("express");
const routes = express();
const userController = require("../controller/usersController");
const { userValidator } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authentication_authorization");

routes.post(
  "/create",
  isAuthenticated,
  isAdmin,
  userValidator.create,
  userController.create
);
routes.delete(
  "/deleteuser",
  isAuthenticated,
  isAdmin,
  userController.deleteUser
);
routes.get("/viewUsers", isAuthenticated, isAdmin, userController.viewUsers);
routes.patch(
  "/editUsersInfo",
  isAuthenticated,
  isAdmin,
  userController.editInformation
);
routes.patch(
  "/updateBalance",
  userValidator.updateBalance,
  userController.updateBalance
);
module.exports = routes;
