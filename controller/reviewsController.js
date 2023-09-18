const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const ReviewModel = require("../model/reviews");
const UserModel = require("../model/users");
const BookModel = require("../model/books");
const HTTP_STATUS = require("../constants/statusCode");
const { sendResponse } = require("../common/common");

class Review {
  async addReviewandRating(req, res) {
    const { user, book, review, rating } = req.body;

    try {
      const existingReview = await ReviewModel.findOne({
        user: user,
        book: book,
      });
      if (existingReview) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "You have already reviewed this book!"
        );
      }

      let checkUser = await UserModel.findOne({ _id: user });
      if (!checkUser) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Create an account first"
        );
      }

      let checkProduct = await BookModel.findOne({ _id: book });
      if (!checkProduct) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Book not found!");
      }

      const newReview = new ReviewModel({
        user: user,
        book: book,
        review: review,
        rating: rating,
      });

      const savedReview = await newReview.save();

      const bookReviews = await ReviewModel.find({ book: book });
      const totalRatings = bookReviews.reduce(
        (total, review) => total + review.rating,
        0
      );
      const averageRating = totalRatings / bookReviews.length;

      const bulkOperations = [
        {
          updateOne: {
            filter: { _id: book },
            update: {
              $set: {
                rating: averageRating,
              },
            },
          },
        },
        {
          updateOne: {
            filter: { _id: book },
            update: {
              $push: {
                reviews: {
                  reviewId: savedReview._id,
                  reviewContent: review,
                },
              },
            },
          },
        },
      ];

      await BookModel.bulkWrite(bulkOperations);

      const reviewUpdated = await BookModel.findById(book);
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Review and rating added",
        reviewUpdated
      );
    } catch (error) {
      console.error(error);

      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
  async updateReviewandRating(req, res) {
    try {
      const { user, bookID, reviewID, reviews, rating } = req.body;
      const existingReview = await ReviewModel.findById({ _id: reviewID });
      if (!existingReview) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "There is no such review exists"
        );
      }
      if (existingReview.user.toString() !== user) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "User is unauthorized."
        );
      }

      existingReview.reviews = reviews;
      existingReview.rating = rating;
      console.log(existingReview.reviews);
      console.log(existingReview.rating);
      await existingReview.save();

      const findBook = await ReviewModel.find({ book: bookID });
      console.log(findBook);
      if (findBook.length > 0) {
        const totalRating = findBook.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        console.log(totalRating);
        const newRating = totalRating / findBook.length;

        await BookModel.findByIdAndUpdate(bookID, { rating: newRating });
        return sendResponse(res, HTTP_STATUS.OK, "Rating updated Successfully");
      } else {
        await BookModel.findByIdAndUpdate(bookID, { rating: 0 });
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "Something went wrong!"
        );
      }
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
  async removeReviewandRating(req, res) {
    const { user, bookID, reviewID, rating } = req.body;
    const review = await ReviewModel.findById(reviewID);
    if (!review) {
      return sendResponse(
        res,
        HTTP_STATUS.NOT_FOUND,
        "Review does not exists!"
      );
    }

    if (review.user.toString() !== user) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized User, You can not delete the review."
      );
    }

    const checkBook = await BookModel.findById(bookID);
    if (!checkBook) {
      return sendResponse(
        res,
        HTTP_STATUS.NOT_FOUND,
        "Associated Book not found!"
      );
    }

    await ReviewModel.findByIdAndDelete(reviewID);
    await BookModel.findByIdAndUpdate(
      review.book,
      {
        $pull: { reviews: { reviewId: review._id } },
      },
      { new: true }
    );
    return sendResponse(res, HTTP_STATUS.OK, "Review Deleted Successfull");
  }
  async viewReviewandRating(req, res) {}
}

module.exports = new Review();
