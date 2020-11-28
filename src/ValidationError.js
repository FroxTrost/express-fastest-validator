class ValidationError extends Error {
  constructor(description) {
    super(description);
    this.message = "request validation error";
    this.description = description;
  }
}

export default ValidationError;
