const express = require("express");
const routes = express();
const reviewController = require("../controller/reviewsController");
const { cartValidator } = require("../middleware/validation");
const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/authentication_authorization");

routes.post("/addtoReviewandRating", reviewController.addReviewandRating);
routes.get("/viewReviewRating", reviewController.viewReviewandRating);
routes.patch("/updateReviewandRating", reviewController.updateReviewandRating);
routes.delete("/removeReviewandRating", reviewController.removeReviewandRating);

module.exports = routes;
