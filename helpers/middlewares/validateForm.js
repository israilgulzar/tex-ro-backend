const { validationResult } = require("express-validator");

module.exports.validateFormFields = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next(); // No errors, continue to the next middleware or route handler
    }

    // Collect all error messages into an object with path as key
    const errorObject = errors.array().reduce((acc, error) => {
      // Check if `param` exists; fallback to `path` if not
      const field = error.param || error.path; // Use `param` or `path` based on the structure
      acc[field] = error.msg;
      return acc;
    }, {});

    // Send response with validation errors
    return res.status(400).json({
      status: false,
      status_code: 400,
      message: "Validation failed!",
      errors: errorObject,
    });
  };
};
