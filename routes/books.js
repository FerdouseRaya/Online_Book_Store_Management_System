const express = require("express");
const routes = express();
const bookController = require("../controller/booksController");
const { bookValidator } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authentication_authorization");

routes.post(
  "/create",
  isAuthenticated,
  isAdmin,
  bookValidator.create,
  bookController.create
);
routes.get("/view", bookController.viewall);
routes.get(
  "/viewBySearch",
  bookValidator.viewBySearch,
  bookController.viewBySearch
);
routes.patch(
  "/editInfo",
  isAuthenticated,
  isAdmin,
  bookValidator.editInformation,
  bookController.editInformation
);
routes.delete(
  "/deleteBooks",
  isAuthenticated,
  isAdmin,
  bookValidator.deleteBooks,
  bookController.deleteBooks
);

routes.post(
  "/addDiscount",
  isAuthenticated,
  isAdmin,
  bookValidator.addDiscount,
  bookController.addDiscount
);
routes.patch(
  "/updateDiscount/:bookID",
  isAuthenticated,
  isAdmin,
  bookValidator.updateDiscount,
  bookController.updateDiscount
);
module.exports = routes;
