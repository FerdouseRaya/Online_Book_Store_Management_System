const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const UsersModel = require("../model/users");
class User {
  async create(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the user!",
          validation
        );
      }
      const { name, email, role, phone, address } = req.body;

      const emailCheck = await UsersModel.findOne({ email: email });
      if (emailCheck) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "This email already exists, Please try another mail."
        );
      }
      const user = await UsersModel.create({
        name: name,
        email: email,
        role: role,
        phone: phone,
        address: {
          house: address.house,
          road: address.road,
          area: address.area,
          city: address.city,
          country: address.country,
        },
      });
      if (user) {
        //console.log(user);
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully added the user",
          user
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Failed to add the user!"
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

module.exports = new User();
