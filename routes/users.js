const express = require("express");
const routes = express();
const userController = require("../controller/usersController");
const { userValidator } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdmin,
  isUserandVerified,
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
  userValidator.deleteUser,
  userController.deleteUser
);
routes.get("/viewUsers", isAuthenticated, isAdmin, userController.viewUsers);
routes.patch(
  "/editUsersInfo",
  isAuthenticated,
  isAdmin,
  userValidator.editInformation,
  userController.editInformation
);
routes.patch(
  "/updateBalance",
  userValidator.updateBalance,
  userController.updateBalance
);
module.exports = routes;
