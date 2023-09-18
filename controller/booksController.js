const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const BookModel = require("../model/books");

class Book {
  async create(req, res) {
    const validation = validationResult(req).array();
    if (validation.length > 0) {
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to add book to the store",
        validation
      );
    }
    const {
      title,
      author,
      ISBN,
      genre,
      price,
      language,
      pageCount,
      availability,
      bestSeller,
      stock,
    } = req.body;
    const defaultReview = "Be the first to add a review for this book";
    const exisitingBook = await BookModel.findOne({ ISBN: ISBN });
    if (exisitingBook) {
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "The book is already  in the store",
        validation
      );
    }
    const books = await BookModel.create({
      title: title,
      author: author,
      ISBN: ISBN,
      genre: genre,
      price: price,
      language: language,
      pageCount: pageCount,
      availability: availability,
      bestSeller: bestSeller,
      stock: stock,
      reviews: [{ reviewContent: defaultReview }],
    });
    if (books) {
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully Books Added!",
        books
      );
    }
  }
  async viewall(req, res) {
    try {
      const getBooks = await BookModel.find({}).limit(10);
      const totalBooks = await BookModel.count();
      if (getBooks.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.FOUND,
          "Successfully received all books!",
          {
            totalBooks: totalBooks,
            countPerPage: getBooks.length,
            result: getBooks,
          }
        );
      }

      return sendResponse(res, HTTP_STATUS.NOT_FOUND, "No Books Found!");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
  async viewBySearch(req, res) {
    try {
      //validation
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to search",
          validation
        );
      }
      //pagination
      const page = Number(req.query.page) || 1; //default setting page at 1
      const productLimit = Number(req.query.limit) || 10; //default setting books per page limit is 10
      const skip = (page - 1) * productLimit;
      //searching,sorting,filtering
      const {
        sortparam,
        sortorder,
        author,
        ISBN,
        genre,
        price,
        language,
        pageCount,
        availability,
        bestSeller,
        stock,
        rating,
      } = req.query;
      const filter = {};

      if (author !== undefined) {
        filter.author = { $regex: author, $options: "i" };
      }
      if (genre !== undefined) {
        filter.genre = { $regex: genre, $options: "i" };
      }
      const getBooks = await BookModel.find(filter)
        .skip(skip)
        .limit(productLimit)
        .sort({ [sortparam]: sortorder });
      const totalBooks = await BookModel.count(filter);
      if (getBooks.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.FOUND,
          "Successfully received the books!",
          {
            totalBooks: totalBooks,
            countPerPage: getBooks.length,
            result: getBooks,
          }
        );
      }

      return sendResponse(res, HTTP_STATUS.NOT_FOUND, "No Books Found!");
    } catch (error) {
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
  async deleteBooks(req, res) {
    const { bookID } = req.body;
    try {
      const deleteItemResult = await BookModel.deleteMany({
        _id: { $in: bookID },
      });
      if (deleteItemResult.deletedCount > 0) {
        return sendResponse(res, HTTP_STATUS.OK, "Book/s deleted Successfully");
      } else {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Book/s not found!");
      }
    } catch (error) {
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
  async editInformation(req, res) {
    try {
      const { bookID, ...updatedData } = req.body;
      const checkBookExists = await BookModel.find({ _id: bookID });
      if (!checkBookExists) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "No book found with this id!"
        );
      }

      const excludedFields = ["ISBN", "rating", "reviews"];
      if (excludedFields.some((field) => field in updatedData)) {
        return sendResponse(
          res,
          HTTP_STATUS.FAILED_DEPENDENCY,
          "Don't have the access to edit these fields"
        );
      }
      const filteredData = Object.keys(updatedData).reduce(
        (previousData, index) => {
          if (!excludedFields.includes(index)) {
            previousData[index] = updatedData[index];
          }
          return previousData;
        },
        {}
      );

      const updatedBook = await BookModel.findByIdAndUpdate(
        { _id: bookID },
        filteredData,
        { new: true }
      );
      if (updatedBook) {
        return sendResponse(res, HTTP_STATUS.OK, {
          message: "Successfully Edited the Book's Information!",
          result: updatedBook,
        });
      } else {
        return sendResponse(
          res,
          HTTP_STATUS.FAILED_DEPENDENCY,
          "Failed to update information!"
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
}
module.exports = new Book();
