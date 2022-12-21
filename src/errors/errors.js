export class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.errorType = "INVALID_ARGUMENT_ERROR";
  }
}
