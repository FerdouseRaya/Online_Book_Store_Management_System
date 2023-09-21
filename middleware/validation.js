const { body, query,param} = require("express-validator");

const authValidator = {
  login: [
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
    body("phone").optional().isMobilePhone(["en-US", "en-GB", "es-ES"]),

    body("address").optional().notEmpty().withMessage("Address is required"),
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
      .withMessage("Author name can not be more than 20 characters."),
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
      .isLength({ max: 15 })
      .withMessage("Genre field can not be more than 15 characters."),
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
      .optional()
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
  editInformation: [
    body("title")
      .optional()
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
      .optional()
      .bail()
      .isString()
      .withMessage("Author name must be string!")
      .bail()
      .notEmpty()
      .withMessage("Author field can not be empty!")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Author name can not be more than 20 characters."),
    body("genre")
      .optional()
      .bail()
      .isString()
      .withMessage("Genre field need to be string!")
      .bail()
      .notEmpty()
      .withMessage("Genre field can not be empty!")
      .bail()
      .isLength({ max: 15 })
      .withMessage("Genre field can not be more than 15 characters."),
    body("price")
      .optional()
      .bail()
      .isNumeric()
      .withMessage("Price must be a number!")
      .bail()
      .notEmpty()
      .withMessage("Price field can not be empty!")
      .isFloat({ min: 5 })
      .withMessage("Price must be greater than or equal to 5(dollars)."),
    body("pageCount")
      .optional()
      .isNumeric()
      .withMessage("Page count must be a number.")
      .bail()
      .notEmpty()
      .withMessage("PageCount field can not be empty!")
      .bail()
      .isInt({ min: 40 })
      .withMessage(
        "Page count must be a positive integer.If the page count is less than 40, this book can't be stored!"
      ),
    body("language")
      .optional()
      .isIn(["English", "Spanish", "French", "German"])
      .withMessage("Invalid language selection.")
      .bail()
      .notEmpty()
      .withMessage("language field can not be empty!"),
  ],
  viewBySearch: [
    query("author")
      .optional()
      .isString()
      .withMessage("Author name must be string!")
      .bail()
      .notEmpty()
      .withMessage("Author field can not be empty!")
      .bail()
      .isLength({ max: 20 })
      .withMessage("Author name can not be more than 30 characters."),
    query("genre")
      .optional()
      .isString()
      .withMessage("Genre field need to be string!")
      .bail()
      .notEmpty()
      .withMessage("Genre field can not be empty!")
      .bail()
      .isLength({ max: 10 })
      .withMessage("Genre field can not be more than 10 characters.")
      .bail()
      .isIn([
        "Fiction",
        "Non-Fiction",
        "Fantasy",
        "'Science fiction",
        "Novel",
        "Mystery",
        "Self-help",
      ])
      .withMessage("Invalid genre selection."),
    query("language")
      .optional()
      .isString()
      .withMessage("quary for language need to be string!")
      .bail()
      .notEmpty()
      .withMessage("quary for language can not be empty!")
      .bail()
      .isLength({ max: 10 })
      .withMessage("quary for language can not be more than 10 characters.")
      .bail()
      .isIn(["English", "Spanish", "French", "German"])
      .withMessage("Invalid language selection."),
    query("ISBN")
      .optional()
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
    query("sortorder")
      .optional()
      .isString()
      .withMessage("Query for sortorder must be a string!")
      .bail()
      .isIn(["asc", "desc"])
      .withMessage("Invalid sort order."),
    query("sortparam")
      .optional()
      .isString()
      .withMessage("Query for sortparam must be a string!")
      .bail()
      .isIn(["price", "rating", "discountPercentage", "stock"])
      .withMessage("Invalid sort parameter."),
    query("availability")
      .optional()
      .isString()
      .withMessage("Query for availability must be a string!")
      .bail()
      .isIn(["true", "false"])
      .withMessage("Invalid request!"),
    query("bestSeller")
      .optional()
      .isString()
      .withMessage("Query for availability must be a string!")
      .bail()
      .isIn(["true", "false"])
      .withMessage("Invalid request!"),
    query("rating")
      .optional()
      .isFloat()
      .withMessage("Rating must be a numeric value."),
    query("fill")
      .optional()
      .isIn(["high", "low"])
      .withMessage("Invalid parameter for fill has been provided."),
    query("price")
      .optional()
      .isFloat()
      .withMessage("Price must be a numeric value."),
    query("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer value."),
    query("pageCount")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Page count must be a non-negative integer value."),
  ],
  addDiscount: [
    body("bookID").isMongoId().withMessage("Invalid book ID format"),
    body("discountPercentage")
      .isNumeric()
      .withMessage("Discount percentage must be a number"),
    body("discountStartTime")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Invalid time format for discountStartTime"),
    body("discountEndTime")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Invalid time format for discountEndTime"),
  ],
  updateDiscount: [
    param("bookID")
    .exists()
    .withMessage("query parameter is missing!"),
    body("discountPercentage")
      .isNumeric()
      .withMessage("Discount percentage must be a number"),
    body("discountStartTime")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Invalid time format for discountStartTime"),
    body("discountEndTime")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Invalid time format for discountEndTime"),
  ],
  deleteBooks: [
    body('bookID')
    .exists()
    .withMessage('bookID field is required')
    .custom((value) => {
      if (!Array.isArray(value)) {
        // If it's not an array, check if it's a valid MongoDB ObjectId
        if (value.trim() === '') {
          throw new Error('bookID cannot be an empty string');
        }
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error('Invalid bookID format');
        }
      } else {
        // If it's an array, validate each item
        for (const id of value) {
          if (id.trim() === '') {
            throw new Error('bookID cannot be an empty string');
          }
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid bookID format');
          }
        }
      }
      return true;
    })
    .toArray(),
  ],
};
const userValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("Name is not provided.")
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
  deleteUser: [
    body("userIDs").notEmpty().withMessage("User IDs array cannot be empty"),
  ],
  editInformation: [
    body("userID")
      .notEmpty()
      .withMessage("User IDs array cannot be empty")
      .isMongoId()
      .withMessage("Invalid user ID format"),
  ],

  updateBalance: [
    body("user")
      .exists()
      .withMessage("User ID need to be provided!")
      .isMongoId()
      .withMessage("Invalid user ID format"),
    body("amount")
      .exists()
      .withMessage("Balance need to be provided!")
      // .custom((value) => {
      //   if (value >3000) {
      //     throw new Error("Balance must be less than or eqaul to 3000");
      //   }
      // }),
  ],
};
const cartValidator = {
  addtoCart: [
    body("userID")
      .exists()
      .withMessage("User ID was not provided!")
      .bail()
      .notEmpty()
      .withMessage("UserID field can not be empty!"),
    body("book")
      .exists()
      .withMessage("bookID was not provided!")
      .bail()
      .notEmpty()
      .withMessage("BookID field can not be empty!"),
    body("quantity")
      .exists()
      .withMessage("quantity was not provided!")
      .bail()
      .notEmpty()
      .withMessage("quantity field can not be empty!"),
  ],
  removefromCart: [
    body("userID")
      .exists()
      .withMessage("User ID was not provided!")
      .bail()
      .notEmpty()
      .withMessage("UserID field can not be empty!"),
    body("book")
      .exists()
      .withMessage("bookID was not provided!")
      .bail()
      .notEmpty()
      .withMessage("BookID field can not be empty!"),
    body("quantity")
      .exists()
      .withMessage("quantity was not provided!")
      .bail()
      .notEmpty()
      .withMessage("quantity field can not be empty!"),
  ],
  viewCart: [
    body("userID")
    .notEmpty()
    .withMessage('userID field cannot be empty')
    .custom((value) => {
      // Check if it's a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid userID format');
      }

      return true;
    }),
  ],
};
const reviewValidator = {
  addReviewandRating: [
    body("user")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ID"),

    body("book")
      .notEmpty()
      .withMessage("Book ID is required")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ID"),

    body("reviews").notEmpty().withMessage("Review content is required"),

    body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isInt({ min: 0, max: 5 })
      .withMessage("Rating must be an integer between 0 and 5"),
  ],
  updateReviewandRating: [
    body("user")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ID"),

    body("bookID")
      .notEmpty()
      .withMessage("Book ID is required")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ID"),

    body("reviewID")
      .notEmpty()
      .withMessage("Review ID is required")
      .isMongoId()
      .withMessage("Review ID must be a valid MongoDB ID"),

    body("reviews").notEmpty().withMessage("Review content is required"),

    body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isInt({ min: 0, max: 5 })
      .withMessage("Rating must be an integer between 0 and 5"),
  ],
  removeReviewandRating: [
    body("user")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ID"),

    body("bookID")
      .notEmpty()
      .withMessage("Book ID is required")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ID"),

    body("reviewID")
      .notEmpty()
      .withMessage("Review ID is required")
      .isMongoId()
      .withMessage("Review ID must be a valid MongoDB ID"),
  ],
  viewReviewandRating: [
    query("bookID")
      .notEmpty()
      .withMessage("Book ID is required")
      .isMongoId()
      .withMessage("Book ID must be a valid MongoDB ID"),
  ],
};
const transactionValidator = {
  checkOut: [
    body("user")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ID"),

    body("cart")
      .notEmpty()
      .withMessage("Cart ID is required")
      .isMongoId()
      .withMessage("Cart ID must be a valid MongoDB ID"),
  ],
  viewTransaction: [
    body("transaction")
      .notEmpty()
      .withMessage("Transaction ID is required")
      .isMongoId()
      .withMessage("Transaction ID must be a valid MongoDB ID"),

    body("user")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("User ID must be a valid MongoDB ID"),
  ],
};
module.exports = {
  bookValidator,
  authValidator,
  userValidator,
  cartValidator,
  reviewValidator,
  transactionValidator,
};
