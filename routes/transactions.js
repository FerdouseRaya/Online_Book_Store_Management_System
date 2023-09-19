const express = require("express");
const routes = express();
const TransactionController = require("../controller/transactionController");
const { transactionValidator } = require("../middleware/validation");

routes.get(
  "/viewTransaction",
  transactionValidator.viewTransaction,
  TransactionController.viewTransaction
);
routes.post(
  "/checkOut",
  transactionValidator.checkOut,
  TransactionController.checkOut
);
routes.get("/viewAllTransaction", TransactionController.viewAllTransaction);
module.exports = routes;
