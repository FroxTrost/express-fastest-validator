const Validator = require('fastest-validator');
const requestProperties = require('./properties');
const ValidationError = require('./ValidationError');

const v = new Validator();

const handleError = (req, res, next, error) => {
  if (req.app.get('errorHandlerMiddleware')) {
    next(new ValidationError(error));
  } else {
    res.status(400).send(error);
  }
};

const validator = (schema = {}) => (req, res, next) => {
  const propertiesToValidate = requestProperties.filter(
    (property) => schema[property] && req[property]
  );

  for (let i = 0; i < propertiesToValidate.length; i += 1) {
    const property = propertiesToValidate[i];

    const check = v.compile(schema[property]);
    const result = check(req[property]);

    if (result !== true) {
      handleError(req, res, next, result);
      return;
    }
  }

  next();
};

module.exports = validator;
