const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
  check('firstName')
    .notEmpty()
    .withMessage('First Name is required'),
  check('lastName')
    .notEmpty()
    .withMessage('Last Name is required'),
  check('email')
    .isEmail()
    .withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.validateSigninRequest = [
  check('email')
    .isEmail()
    .withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.isRequestValidated = (req, resp, next) => {
  const errors = validationResult(req);
  if (errors.array().length) {
    return resp.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
