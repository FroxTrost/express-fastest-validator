import Validator from "fastest-validator";
import requestProperties from "./properties";
import ValidationError from "./ValidationError";

const v = new Validator();

const validator = (schema = {}) => (req, res, next) => {
  const check = v.compile(schema);

  const propertiesToValidate = requestProperties.filter(
    (property) => schema[property] && req[property]
  );

  for (let property of propertiesToValidate) {
    const result = check(req[property]);

    if (Array.isArray(result) && result !== true) {
      next(new ValidationError(result));
      break;
    }
  }
};

export default validator;
