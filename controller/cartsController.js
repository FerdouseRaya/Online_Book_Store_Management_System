const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const CartModel = require("../model/carts");
const UserModel = require("../model/users");
const BookModel = require("../model/books");
function writeToLog(Path, logEntry) {
  let logFile = Path;
  fs.appendFile(logFile, logEntry + "\n", (err) => {
    if (err) {
      console.error(`Error writing to log file: ${err}`);
    }
  });
}
class Cart {
  async addtoCart(req, res) {
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
      const { userID, book, quantity } = req.body;
      const checkUserExists = await UserModel.findOne({ _id: userID });
      if (!checkUserExists) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "You are not a user, first create an account."
        );
      }
      let cartItem = await CartModel.findOne({ user: userID });

      if (!cartItem) {
        cartItem = new CartModel({
          user: userID,
          books: [],
          Total: 0,
          TotalDiscountPercentage: 0,
        });
      }
      // Find the selected book
      const selectedBook = cartItem.books.find((item) => {
        return (
          item.book && book && item.book._id.toString() === book.toString()
        );
      });
      if (!selectedBook) {
        const bookInfo = await BookModel.findById(book);

        if (!bookInfo) {
          return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Book not found!");
        }
        let bookPrice = bookInfo.price;
        if (
          bookInfo.discountPercentage &&
          bookInfo.discountStartTime &&
          bookInfo.discountEndTime
        ) {
          const currentTime = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });
          if (
            currentTime >= bookInfo.discountStartTime &&
            currentTime <= bookInfo.discountEndTime
          ) {
            bookPrice =
              bookPrice - (bookPrice * bookInfo.discountPercentage) / 100;
          }
          if (bookInfo.stock < quantity) {
            return sendResponse(
              res,
              HTTP_STATUS.UNPROCESSABLE_ENTITY,
              "Not enough books are in the stock."
            );
          }

          cartItem.books.push({
            book: book,
            quantity: quantity,
            Total: bookPrice,
          });
          cartItem.discountPercentage += bookInfo.discountPercentage || 0;
        } else {
          selectedBook.quantity += quantity;
          cartItem.TotalDiscountPercentage += bookInfo.discountPercentage || 0;
        }
      } else {
        const bookInfo = await BookModel.findById(selectedBook.book);
        if (bookInfo.stock < selectedBook.quantity + quantity) {
          return sendResponse(
            res,
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "Required Book is out of stock."
          );
        }

        selectedBook.quantity += quantity;
      }

      let total = 0;
      const booksList = cartItem.books.map((item) => item.book);
      const booksInCart = await BookModel.find({
        _id: {
          $in: booksList,
        },
      }).select("price");

      total = booksInCart.reduce((previousValue, currentValue, i) => {
        return previousValue + currentValue.price * cartItem.books[i].quantity;
      }, 0);

      cartItem.Total = total;
      await cartItem.save();
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Product Added to cart successfully",
        cartItem
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
  async viewCart(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the User!",
          validation
        );
      }
      const { userID } = req.body;
      const user = await UserModel.findById({ _id: userID });
      if (!user) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User not found!");
      }
      const cartItem = await CartModel.findOne({ user: userID }).populate(
        "books.book",
        "title author price rating stock"
      );
      if (!cartItem) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Cart not found for the user"
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Cart retrieved successfully",
        cartItem
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error..."
      );
    }
  }
  async removefromCart(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the User!",
          validation
        );
      }
      const { userID, book, quantity } = req.body;
      // Check if the user exists
      // const user = await UserModel.findById(userID);
      // if (!user) {
      //   return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User not found!");
      // }

      // Find the user's cart
      let cartItem = await CartModel.findOne({ user: userID });
      let cartItem1 = await CartModel.findOne({ user: userID }).populate(
        "books.book",
        "title price rating stock"
      );
      if (!cartItem) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Cart not found for the user!"
        );
      }
      if (quantity === 0) {
        // Remove the entire cart if quantity is set to 0
        await cartItem.remove();
        return sendResponse(res, HTTP_STATUS.OK, "Cart removed successfully!");
      }
      // Check if the product is in the user's cart
      const existingBookIndex = cartItem.books
        ? cartItem.books.findIndex((item) => item.book.toString() === book)
        : -1;

      if (existingBookIndex === -1) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "This book is not found in your cart."
        );
      }
      cartItem.books.splice(existingBookIndex, 1);
      let perquantityPrice = 0;
      for (const cartProduct of cartItem1.books) {
        const { price } = cartProduct.book;
        // console.log(price);
        // console.log(quantity);
        perquantityPrice = price * quantity;
        //console.log(perquantityPrice);
      }
      cartItem.Total = cartItem.Total - perquantityPrice;
      await cartItem.save();
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "This book has been removed from your Cart.",
        cartItem
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
}
module.exports = new Cart();
