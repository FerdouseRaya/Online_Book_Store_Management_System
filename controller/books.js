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
      rating,
    } = req.body;
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
      rating: rating,
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
}
module.exports = new Book();
