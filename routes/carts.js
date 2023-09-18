const express = require("express");
const routes = express();
const cartController = require("../controller/cartsController");
const { cartValidator } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authentication_authorization");

routes.post("/addtoCart", cartValidator.addtoCart, cartController.addtoCart);
routes.get("/viewCart", cartController.viewCart);
routes.delete("/removefromCart", cartController.removefromCart);

module.exports = routes;
