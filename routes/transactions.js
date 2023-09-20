const express = require("express");
const routes = express();
const TransactionController = require("../controller/transactionController");
const { transactionValidator } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdmin,
  isUserandVerified,
} = require("../middleware/authentication_authorization");

routes.get(
  "/viewTransaction",
  isUserandVerified,
  transactionValidator.viewTransaction,
  TransactionController.viewTransaction
);
routes.post(
  "/checkOut",
  isUserandVerified,
  transactionValidator.checkOut,
  TransactionController.checkOut
);
routes.get(
  "/viewAllTransaction",
  isAuthenticated,
  isAdmin,
  TransactionController.viewAllTransaction
);
module.exports = routes;
