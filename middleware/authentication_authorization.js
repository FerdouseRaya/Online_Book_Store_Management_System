const jsonwebtoken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendResponse } = require("../common/common");
const HTTP_STATUS = require("../constants/statusCode");

const isAuthorized = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Not Authorized!");
    }

    const jwtToken = req.headers.authorization.split("")[1];
    const validation = jsonwebtoken.verify(jwtToken, process.env.SECRET_KEY);
    if (validation) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Token Invalid!");
    }
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      return sendResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Please Login in Again!"
      );
    }

    return sendResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Internal Server Error..."
    );
  }
};
const isAdmin = (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.decode(jwtToken);
    if (!decodedToken) {
      throw new Error();
    }
    if (decodedToken.role === 1) {
      console.log("Hello");
      res.status(200).send(success("Hello Admin!"));
      next();
    } else {
      res
        .status(400)
        .send(failure("User is not an Admin. Permission Denied!!!"));
    }
  } catch (error) {
    res.status(400).send(failure("Autentication Error"));
  }
};
module.exports = { isAuthorized, isAdmin };
