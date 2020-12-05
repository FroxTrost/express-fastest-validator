class FXValidationError extends Error {
  constructor(description) {
    super(description);
    this.message = 'request validation error';
    this.description = description;
  }
}

module.exports = FXValidationError;
