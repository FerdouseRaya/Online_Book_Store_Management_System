const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");
const AuthModel = require("../model/authentication_authorization");
const UserModel = require("../model/users");

class Auth {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const authorizedUser = await AuthModel.findOne({ email: email })
        .populate("user", "-createdAt -updatedAt")
        .select("-id -name -email -address -createdAt -updatedAt");
      console.log(authorizedUser);
      console.log(authorizedUser.lastFailedLogin);
      console.log(authorizedUser.failedLoginAttempts);
      if (!authorizedUser) {
        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "User is not registered!"
        );
      }

      const timeSinceLastAttempt = new Date() - authorizedUser.lastFailedLogin;
      const timeout = 1 * 60 * 1000; // 1 minute in milliseconds
      console.log(authorizedUser.failedLoginAttempts);
      console.log(timeSinceLastAttempt);
      if (
        authorizedUser.failedLoginAttempts >= 5 &&
        timeSinceLastAttempt < timeout
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.LOCKED,
          "Account Locked! Please try again later!"
        );
      }

      const isValidPassword = await bcrypt.compare(
        password,
        authorizedUser.password
      );

      if (isValidPassword) {
        // Reset failed login attempts and last failed login timestamp
        authorizedUser.failedLoginAttempts = 0;
        authorizedUser.lastFailedLogin = null;

        // Generate and send JWT token
        const responseAuth = authorizedUser.toObject();
        delete responseAuth.password;
        const jswt = jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        responseAuth.token = jswt;
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          "Successfully logged in...",
          responseAuth
        );
      } else {
        // Increment failed login attempts and record last failed login timestamp
        authorizedUser.failedLoginAttempts += 1;
        authorizedUser.lastFailedLogin = new Date();
        await authorizedUser.save();

        return sendResponse(
          res,
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid Credentials!"
        );
      }
    } catch (error) {
      console.error(error);
      return sendResponse(
        res,
        HTTP_STATUS.NON_AUTHORITATIVE_INFORMATION,
        "Authentication Error..."
      );
    }
  }

  async signup(req, res) {
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

      const { name, email, password, role, phone, address, verified } =
        req.body;
      const existingEmail = await UserModel.findOne({ email: email });
      if (existingEmail) {
        return sendResponse(
          res,
          HTTP_STATUS.CONFLICT,
          "Email is already registered!"
        );
      }
      const hasedPassword = await bcrypt.hash(password, 10).then((hash) => {
        return hash;
      });
      //creating the user in the user collection
      const newUser = await UserModel.create({
        name: name,
        email: email,
        password: hasedPassword,
        role: role,
        phone: phone,
        address: {
          house: address.house,
          road: address.road,
          area: address.area,
          city: address.city,
          country: address.country,
        },
        verified: verified,
      });

      const savedUser = await newUser.save();

      //creating the user in the authentication_authorization collection
      const authUser = await AuthModel.create({
        name: name,
        email: email,
        password: hasedPassword,
        role: role,
        phone: phone,
        address: {
          house: address.house,
          road: address.road,
          area: address.area,
          city: address.city,
          country: address.country,
        },
        verified: verified,
        user: savedUser._id,
      });
      await authUser.save();

      if (!authUser) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "SignUP unsuccessful, failed to add the user!"
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully SingedUP!",
        authUser
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
}
module.exports = new Auth();
