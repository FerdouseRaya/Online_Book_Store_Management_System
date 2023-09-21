const path = require("path");
const fs = require("fs");
const { writeToLog } = require("../middleware/log");
const schedule = require("node-schedule");
const cron = require("node-cron");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const BookModel = require("../model/books");
const logFilePath = path.join(__dirname, "../server", "admin_log.log");
const logFileSearch = path.join(__dirname, "../server", "search_bar.log");
const logFileUser = path.join(__dirname, "../server", "user_log.log");

class Book {
  async create(req, res) {
    try {
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
        const logMessage = `Time:${new Date()} |success|URL: ${req.hostname}${
          req.port ? ":" + req.port : ""
        }${req.originalUrl}`;
        writeToLog(logFilePath, logMessage);
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully Books Added!",
          books
        );
      }
    } catch (error) {
      const logMessage = `Time:${new Date()} |failed|URL: ${req.hostname}${
        req.port ? ":" + req.port : ""
      }${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFilePath, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server error!"
      );
    }
  }
  async viewall(req, res) {
    try {
      const getBooks = await BookModel.find({}).limit(10);
      const totalBooks = await BookModel.count();
      if (getBooks.length > 0) {
        const logMessage = `Time: ${new Date()} |success Message: Successfully received all books!|URL: ${
          req.hostname
        }${req.port ? ":" + req.port : ""}${req.originalUrl}`;
        writeToLog(logFileSearch, logMessage);
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
      const logMessage = `Time:${new Date()} |failed Message:Internal Server Error...|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFileSearch, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
  async viewBySearch(req, res) {
    try {
      // Validation
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to search",
          validation
        );
      }

      // Pagination
      const page = Number(req.query.page) || 1; // Default to page 1
      const productLimit = Number(req.query.limit) || 10; // Default limit to 10 items per page
      const skip = (page - 1) * productLimit;

      // Search, sorting, and filtering parameters
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
        fill,
        search,
      } = req.query;

      const filter = {};

      // Apply filters b

      // Rating filter
      if (rating && fill) {
        filter.rating =
          fill === "high" ? { $gte: Number(rating) } : { $lte: Number(rating) };
      }

      // Price filter
      if (price && fill) {
        filter.price =
          fill === "high" ? { $gte: Number(price) } : { $lte: Number(price) };
      }

      // Stock filter
      if (stock && fill) {
        filter.stock =
          fill === "high" ? { $gte: Number(stock) } : { $lte: Number(stock) };
      }

      // Page count filter
      if (pageCount && fill) {
        filter.pageCount =
          fill === "high"
            ? { $gte: Number(pageCount) }
            : { $lte: Number(pageCount) };
      }

      // Availability, Best Seller, ISBN, Author, Genre, Language filters
      if (availability) {
        filter.availability = { $regex: new RegExp(availability, "i") };
      }
      if (bestSeller) {
        filter.bestSeller = { $regex: new RegExp(bestSeller, "i") };
      }
      if (ISBN) {
        filter.ISBN = { $regex: new RegExp(ISBN, "i") };
      }
      if (author) {
        filter.author = { $regex: new RegExp(author, "i") };
      }
      if (genre) {
        filter.genre = { $regex: new RegExp(genre, "i") };
      }
      if (language) {
        filter.language = { $regex: new RegExp(language, "i") };
      }

      // General search query
      if (search) {
        filter.$or = [
          { title: { $regex: new RegExp(search, "i") } },
          { author: { $regex: new RegExp(search, "i") } },
          { genre: { $regex: new RegExp(search, "i") } },
        ];
      }

      // Execute the database query with filters, pagination, and sorting
      const getBooks = await BookModel.find(filter)
        .skip(skip)
        .limit(productLimit)
        .sort({ [sortparam]: sortorder });

      const totalBooks = await BookModel.countDocuments(filter);

      if (getBooks.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.FOUND,
          "Successfully received the books!",
          {
            TotalBooks: totalBooks,
            countPerPage: getBooks.length,
            result: getBooks,
          }
        );
      }

      return sendResponse(res, HTTP_STATUS.NOT_FOUND, "No Books Found!");
    } catch (error) {
      const logMessage = `Time:${new Date()} |failed Message: Internal Server Error...|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFilePath, logMessage);
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }

  async deleteBooks(req, res) {
    const validation = validationResult(req).array();
    if (validation.length > 0) {
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to Delete...",
        validation
      );
    }

    try {
      const { bookID } = req.body;
      const deleteItemResult = await BookModel.deleteMany({
        _id: { $in: bookID },
      });
      if (deleteItemResult.deletedCount > 0) {
        return sendResponse(res, HTTP_STATUS.OK, "Book/s deleted Successfully");
      } else {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Book/s not found!");
      }
    } catch (error) {
      const logMessage = `Time:${new Date()} |failed Message: Internal Server Error...|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFilePath, logMessage);

      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
  async editInformation(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add book to the store",
          validation
        );
      }
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
      if (Object.keys(updatedData).length === 0) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          "At least one field should be provided for updating"
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
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully Edited the Book's Information!",
          updatedBook
        );
      } else {
        const logMessage = `Time:${new Date()} |failed:Failed to update information!"|URL: ${
          req.hostname
        }${req.port ? ":" + req.port : ""}${
          req.originalUrl
        }| [error: ${error}]`;
        writeToLog(logFilePath, logMessage);
        return sendResponse(
          res,
          HTTP_STATUS.FAILED_DEPENDENCY,
          "Failed to update information!"
        );
      }
    } catch (error) {
      console.log(error);
      const logMessage = `Time:${new Date()} |failed|URL: ${req.hostname}${
        req.port ? ":" + req.port : ""
      }${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFilePath, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
  async addDiscount(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add discount!",
          validation
        );
      }
      const { bookID, discountPercentage, discountStartTime, discountEndTime } =
        req.body;
      const checkBookExists = await BookModel.find({ _id: bookID });
      if (!checkBookExists) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "No book found with this id!"
        );
      }
      cron.schedule("0 0 * * *", async () => {
        // Calculate the current time in HH:mm format
        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });

        await Book.updateMany(
          {
            discountEndTime: { $lte: currentTime },
          },
          {
            $unset: {
              discountPercentage: 1,
              discountStartTime: 1,
              discountEndTime: 1,
            },
          }
        );
        console.log("Expired discounts removed.");
      });
      const book = await BookModel.findByIdAndUpdate(
        bookID,
        {
          discountPercentage,
          discountStartTime,
          discountEndTime,
        },
        { new: true }
      );

      console.log(book);
      return sendResponse(res, HTTP_STATUS.OK, "Discount added Successfully");
    } catch (error) {
      console.log(error);
      const logMessage = `Time:${new Date()} |failed|URL: ${req.hostname}${
        req.port ? ":" + req.port : ""
      }${req.originalUrl}| [error: ${error}]`;
      writeToLog(logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
  async updateDiscount(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to update discount!",
          validation
        );
      }
      const { bookID } = req.params;
      const { discountPercentage, discountStartTime, discountEndTime } =
        req.body;
      const checkBookExists = await BookModel.findById({ _id: bookID });
      if (!checkBookExists) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "No book found with this id!"
        );
      }

      if (!checkBookExists.discountPercentage) {
        const logMessage = `Time:${new Date()} |failed Message:No existing discountPercentage for this|URL: ${
          req.hostname
        }${req.port ? ":" + req.port : ""}${
          req.originalUrl
        }| [error: ${error}]`;
        writeToLog(logFileUser, logMessage);
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "No existing discountPercentage for this "
        );
      }

      checkBookExists.discountPercentage = discountPercentage;
      checkBookExists.discountStartTime = discountStartTime;
      checkBookExists.discountEndTime = discountEndTime;
      await checkBookExists.save();
      const logMessage = `Time: ${new Date()} |success:Successfully updated the discount for the book!|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}`;
      writeToLog(logFileUser, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully updated the discount for the book!"
      );
    } catch (error) {
      console.log(error);
      const logMessage = `Time:${new Date()} |failed Message:Internal Server Error...|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFileUser, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
}
module.exports = new Book();
