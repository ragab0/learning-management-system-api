/**
 * global error schema/stamba that all our created errors will foloow - will be look like;
 *
 */
module.exports = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
  }
};
