const { body, params } = require("express-validator");

const bookValidator = {
  create: [
    body("title")
      .exists()
      .withMessage("Title was not provided!")
      .bail()
      .isString()
      .withMessage("Title must be string!")
      .bail()
      .notEmpty()
      .withMessage("Title field can not be empty!")
      .bail()
      .isLength({ max: 50 })
      .withMessage("The title can not be more than 50 characters."),
    body("author")
      .exists()
      .withMessage("Author name was not provided!")
      .bail()
      .isString()
      .withMessage("Author name must be string!")
      .bail()
      .notEmpty()
      .withMessage("Author field can not be empty!")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Author name can not be more than 30 characters."),
    // body("ISBN")
    //   .exists()
    //   .withMessage("ISBN number was not provided!")
    //   .bail()
    //   .isString()
    //   .withMessage("ISBN must be string")
    //   .bail()
    //   .notEmpty()
    //   .withMessage("ISBN is required, can not be empty!")
    //   .bail()
    //   .isLength({ min: 10, max: 13 })
    //   .withMessage("The number should be in between 10 or 13 numbers!"),
    body("genre")
      .exists()
      .withMessage("Genre was not provided!")
      .bail()
      .isString()
      .withMessage("Genre field need to be string!")
      .bail()
      .notEmpty()
      .withMessage("Genre field can not be empty!")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Genre field can not be more than 10 characters."),
    body("price")
      .isNumeric()
      .withMessage("Price must be a number.")
      .isFloat({ min: 5 })
      .withMessage("Price must be greater than or equal to 5(dollars)."),
    body("rating")
      .isNumeric()
      .withMessage("Rating must be a number.")
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 0 and 5."),
    body("pageCount")
      .optional()
      .isNumeric()
      .withMessage("Page count must be a number.")
      .isInt({ min: 40 })
      .withMessage(
        "Page count must be a positive integer.If the page count is less than 40, this book can't be stored!"
      ),
    body("language")
      .optional()
      .isIn(["English", "Spanish", "French", "German"])
      .withMessage("Invalid language selection."),
  ],
};

module.exports = { bookValidator };
