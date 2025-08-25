const { body, query } = require("express-validator");

exports.userCreateRules = [
  body("name").isLength({ min: 20, max: 60 }).withMessage("Name 20–60 chars"),
  body("email").isEmail().withMessage("Invalid email"),
  body("address").isLength({ max: 400 }).withMessage("Address ≤ 400 chars"),
  body("password")
    .isLength({ min: 8, max: 16 }).withMessage("Password 8–16 chars")
    .matches(/[A-Z]/).withMessage("Must include uppercase")
    .matches(/[^\w\s]/).withMessage("Must include special char"),
  body("role").optional().isIn(["admin", "user", "owner"]).withMessage("Invalid role"),
];

exports.passwordUpdateRules = [
  body("oldPassword").notEmpty(),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/).matches(/[^\w\s]/),
];

exports.storeCreateRules = [
  body("name").isLength({ min: 1 }),
  body("email").isEmail(),
  body("address").isLength({ max: 400 }),
  body("ownerId").isInt(),
];

exports.storeListQueryRules = [
  query("search").optional().isString(),
  query("sortBy").optional().isIn(["name","email","address","rating"]),
  query("order").optional().isIn(["asc","desc"]),
];

exports.ratingRules = [
  body("value").isInt({ min:1, max:5 }),
];

exports.handleValidation = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};
