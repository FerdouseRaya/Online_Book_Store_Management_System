const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const CartModel = require("../model/carts");
const UserModel = require("../model/users");
const transactionModel = require("../model/transactions");
class transaction {
  async checkOut(req, res) {
    try {
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
        const { price, stock } = book;

        if (stock < quantity) {
          return sendResponse(
            res,
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            "Product is out of stock!"
          );
        }

        total = total + price * quantity;
        console.log(total);

        transactionItems.push({ book: book._id, quantity });
        book.stock = book.stock - quantity;
        await book.save();
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
      return sendResponse(res, HTTP_STATUS.OK, "Transaction Successfull!");
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error."
      );
    }
  }
  async viewTransaction(req, res) {
    try {
      const { transaction, user } = req.body;
      const transactionItem = await transactionModel
        .findOne({
          _id: transaction,
          user: user,
        })
        .populate("user", "name email phone wallets_balance")
        .populate("books.book", "-_id title author price rating reviews")
        .select("-__v");
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
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal Server Error!"
      );
    }
  }
}
module.exports = new transaction();
