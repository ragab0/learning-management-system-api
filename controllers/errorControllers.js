const AppError = require("../utils/appError");
module.exports = function mainErrorController(err, req, res, next) {
  if (!err.isOperational) {
    if (false) {
    } else if (false) {
    } else if (false) {
    } else if (false) {
    } else if (false) {
    } else {
      if (process.env.NODE_ENV === "development") {
        err = globalHandlerDev(err);
      } else {
        err = globalHandlerPro();
      }
    }
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
      error: err,
      errorStack: err.stack,
    });
  } else {
    return res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
    });
  }
};

function globalHandlerDev(err) {
  return new AppError(err.message, 500);
}
function globalHandlerPro() {
  return new AppError("Something went wrong!", 500);
}
