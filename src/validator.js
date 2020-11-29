const Validator = require("fastest-validator");
const requestProperties = require("./properties");
const ValidationError = require("./ValidationError");

const v = new Validator();

const validator = (schema = {}) => (req, res, next) => {
  const propertiesToValidate = requestProperties.filter(
    (property) => schema[property] && req[property]
  );

  for (let property of propertiesToValidate) {
    const check = v.compile(schema[property]);
    const result = check(req[property]);

    if (Array.isArray(result) && result !== true) {
      next(new ValidationError(result));
      return;
    }
  }
  next();
};

module.exports = validator;
