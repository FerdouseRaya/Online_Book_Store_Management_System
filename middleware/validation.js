const { body, params } = require("express-validator");

const authValidator = {
  signup: [
    body("email")
      .exists()
      .withMessage("Email must be provided")
      .bail()
      .isString()
      .withMessage("Email must be a String")
      .bail()
      .isEmail()
      .withMessage("Provide the right email formate")
      .custom((value) => {
        if (!value.includes("@") || !value.includes(".")) {
          throw new Error("Email must include '@' and a valid domain.");
        }
        return true;
      })
      .withMessage("Email must include '@' and a valid domain."),
    body("password")
      .exists()
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be a String")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password should be at least 8 characters, with a minimum of 1 lowercase, 1 uppercase, 1 number, and 1 symbol."
      ),
  ],
};
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
    body("ISBN")
      .exists()
      .withMessage("ISBN number was not provided!")
      .bail()
      .isString()
      .withMessage("ISBN must be string")
      .bail()
      .notEmpty()
      .withMessage("ISBN is required, can not be empty!")
      .bail()
      .custom((value) => {
        const cleanedISBN = value.replace(/-/g, "").replace(/\D/g, "");
        if (!cleanedISBN) {
          throw new Error(
            "ISBN is required and must contain at least one digit."
          );
        }
        if (cleanedISBN.length < 8 || cleanedISBN.length > 15) {
          throw new Error(
            "The ISBN should have between 8 and 15 digits (ignoring hyphens)."
          );
        }
        return true;
      })
      .withMessage("Invalid ISBN format or length."),
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
      .exists()
      .withMessage("Price was not provided!")
      .bail()
      .isNumeric()
      .withMessage("Price must be a number!")
      .bail()
      .isFloat({ min: 5 })
      .withMessage("Price must be greater than or equal to 5(dollars)."),
    body("rating")
      .exists()
      .withMessage("Rating was not provided!")
      .bail()
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
const userValidator = {
  create: [
    body("name")
      .trim()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 30 })
      .withMessage("Name must not exceed 30 characters")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .notEmpty()
      .withMessage("Email is required"),

    body("role").optional().isNumeric().withMessage("Role must be a number"),

    body("phone").notEmpty().withMessage("Phone number is required"),

    body("address.house")
      .trim()
      .isString()
      .withMessage("House must be a string")
      .notEmpty()
      .withMessage("House is required"),

    body("address.road")
      .trim()
      .isString()
      .withMessage("Road must be a string")
      .notEmpty()
      .withMessage("Road is required"),

    body("address.area")
      .trim()
      .isString()
      .withMessage("Area must be a string")
      .notEmpty()
      .withMessage("Area is required"),

    body("address.city")
      .trim()
      .isString()
      .withMessage("City must be a string")
      .notEmpty()
      .withMessage("City is required"),

    body("address.country")
      .trim()
      .isString()
      .withMessage("Country must be a string")
      .notEmpty()
      .withMessage("Country is required"),
  ],
};
module.exports = { bookValidator, authValidator, userValidator };
