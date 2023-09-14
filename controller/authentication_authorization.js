const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const AuthModel = require("../model/authentication_authorization");

class Auth {
  async login(req, res) {
    const { email, password } = req.body;
  }
  async signup(req, res) {}
}
module.exports = new Auth();
