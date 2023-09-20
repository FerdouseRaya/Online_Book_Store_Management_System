const express = require("express");
const routes = express();
const reviewController = require("../controller/reviewsController");
const { reviewValidator } = require("../middleware/validation");
const {
  isUserandVerified,
} = require("../middleware/authentication_authorization");

routes.post(
  "/addtoReviewandRating",
  isUserandVerified,
  reviewValidator.addReviewandRating,
  reviewController.addReviewandRating
);
routes.get(
  "/viewAverageRating/:bookID",
  reviewValidator.viewReviewandRating,
  reviewController.viewAverageRating
);
routes.patch(
  "/updateReviewandRating",
  isUserandVerified,
  reviewValidator.updateReviewandRating,
  reviewController.updateReviewandRating
);
routes.delete(
  "/removeReviewandRating",
  isUserandVerified,
  reviewValidator.removeReviewandRating,
  reviewController.removeReviewandRating
);

module.exports = routes;
