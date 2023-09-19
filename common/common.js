const { response } = require("express");

const sendResponse = (res, status, message, result = null) => {
  const response = {};

  if (status >= 400) {
    response.success = false;
    response.error = result;
    response.message = "Internal Server Error";
  } else {
    response.success = true;
    response.result = result;
    response.message = "Successfully completed the operations.";
  }

  if (message) {
    response.message = message;
  }
  res.status(status).send(response);
};

module.exports = { sendResponse };
