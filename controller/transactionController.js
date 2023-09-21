const path = require("path");
const fs = require("fs");
const { writeToLog } = require("../middleware/log");
const schedule = require("node-schedule");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const CartModel = require("../model/carts");
const UserModel = require("../model/users");
const transactionModel = require("../model/transactions");
const logFilePath = path.join(__dirname, "../server", "user_log,log");
const logFileUser = path.join(__dirname, "../server", "user_log.log");

// Helper function to check if the discount is active
function isDiscountActive(startTime, endTime, currentTime) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const [currentHour, currentMinute] = currentTime.split(":").map(Number);

  // Compare hours and minutes to determine if the current time is within the discount period
  if (
    currentHour > startHour ||
    (currentHour === startHour && currentMinute >= startMinute)
  ) {
    if (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute <= endMinute)
    ) {
      return true;
    }
  }

  return false;
}
class transaction {
  async checkOut(req, res) {
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

      const { user, cart } = req.body;
      const cartItem = await CartModel.findOne({
        _id: cart,
        user: user,
      }).populate("books.book");
      if (!cartItem || cartItem.books.length == 0) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Cart is not found for the user!"
        );
      }
      let total = 0;
      let transactionItems = [];
      for (const item of cartItem.books) {
        const { book, quantity } = item;
        const {
          price,
          stock,
          discountPercentage,
          discountStartTime,
          discountEndTime,
        } = book;

        if (stock < quantity) {
          return sendResponse(
            res,
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "Product is out of stock!"
          );
        }

        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        let appliedDiscountMessage = "";
        if (
          discountPercentage &&
          isDiscountActive(discountStartTime, discountEndTime, currentTime)
        ) {
          let discountedPrice = price - (price * discountPercentage) / 100;
          total = total + discountedPrice * quantity;
          appliedDiscountMessage = `Discount of ${discountPercentage}% applied.`;
        } else {
          total = total + price * quantity;
        }

        transactionItems.push({ book: book._id, quantity });
        book.stock -= quantity;
        await book.save();

        transactionItems[transactionItems.length - 1].appliedDiscount =
          appliedDiscountMessage;
      }
      const fetchBalance = await UserModel.findById({ _id: user }).populate(
        "wallets_balance"
      );
      console.log(fetchBalance.wallets_balance);
      if (fetchBalance.wallets_balance < total) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Sorry! Your balance is not sufficien for the transaction."
        );
      }
      fetchBalance.wallets_balance = fetchBalance.wallets_balance - total;
      await fetchBalance.save();

      const transaction = new transactionModel({
        cart: cartItem._id,
        user,
        books: transactionItems,
        Total: total,
      });

      await transaction.save();
      cartItem.Total = 0;
      await cartItem.save();
      const logMessage = `Time: ${new Date()} |success Message:Transaction Successfull!|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}`;
      writeToLog(logFilePath, logMessage);

      return sendResponse(res, HTTP_STATUS.OK, "Transaction Successfull!", {
        transaction: transaction,
        appliedDiscountMessages: transactionItems.map(
          (item) => item.appliedDiscount
        ),
      });
    } catch (error) {
      console.log(error);
      const logMessage = `Time:${new Date()} |failed Message: Internal Server Error.|URL: ${
        req.hostname
      }${req.port ? ":" + req.port : ""}${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFilePath, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error."
      );
    }
  }
  async viewTransaction(req, res) {
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
      const { transaction, user } = req.body;
      const transactionItem = await transactionModel
        .findOne({
          _id: transaction,
          user: user,
        })
        .populate("user", "-_id name email phone wallets_balance")
        .populate(
          "books.book",
          "-_id -genre -pageCount -availability -bestSeller -rating -reviews -createdAt -updatedAt -__v"
        )
        .select("-__v -createdAt -updatedAt");
      console.log(transactionItem);
      if (!transactionItem) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "No transaction is found for the user!"
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Transaction Information retrive successfully",
        transactionItem
      );
    } catch (error) {
      console.log(error);
      const logMessage = `Time:${new Date()} |failed|URL: ${req.hostname}${
        req.port ? ":" + req.port : ""
      }${req.originalUrl}| [error: ${error}]`;
      writeToLog(logFileUser, logMessage);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
  async viewAllTransaction(req, res) {
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
      const allTransactions = await transactionModel
        .find({})
        .populate("user", "-_id name email phone wallets_balance")
        .populate(
          "books.book",
          "-_id -genre -pageCount -availability -bestSeller -rating -reviews -createdAt -updatedAt -__v"
        )
        .select("-__v -createdAt -updatedAt");

      if (!allTransactions && allTransactions === 0) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "No transactions found!"
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "All Transactions Information retrieved successfully",
        allTransactions
      );
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
}
module.exports = new transaction();
