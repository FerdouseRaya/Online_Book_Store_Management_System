const dotenv = require("dotenv").config();
const cors = require("cors");
const { sendResponse } = require("./common/common");
const HTTP_STATUS = require("./constants/statusCode");

//Database connection
const databaseConnection = require("./config/database");

//Express Modules
const express = require("express");
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

//Exporting all the routes
const booksRouter = require("./routes/books");
const authRouter = require("./routes/authentication_authorization");

//main routers
app.use("/books", booksRouter);
app.use("/auth", authRouter);

//Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid JSON Format!");
  }
  next();
});

app.use("*", (req, res) => {
  return sendResponse(
    res,
    HTTP_STATUS.NOT_FOUND,
    "Wrong URL, Please re-check your URL."
  );
});

databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
