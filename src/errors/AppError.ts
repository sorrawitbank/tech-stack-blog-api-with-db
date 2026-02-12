/**
 * Custom error with HTTP status code for controller to return correct response.
 * Use 4xx for client errors (e.g. 404 Not Found), 5xx for server errors.
 */
class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
