const express = require("express");
const routes = express();
const TransactionController = require("../controller/transactionController");

routes.get("/viewTransaction", TransactionController.viewTransaction);
routes.post("/checkOut", TransactionController.checkOut);

module.exports = routes;
