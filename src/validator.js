const Validator = require("fastest-validator");
const ValidationError = require("./ValidationError");

const v = new Validator();

const validator = (schema = {}, { customErrorMiddleware = false }) => (req, res, next) => {
  for (let property in schema) {
    const check = v.compile(schema[property]);
    const result = check(req[property]);
    if (result !== true) {
      if (customErrorMiddleware) {
        next(new ValidationError(result));
      } else {
        res.status(400).end(JSON.stringify(result, null, 2));
      }
      return;
    }
  }
  next();
};

module.exports = validator;
