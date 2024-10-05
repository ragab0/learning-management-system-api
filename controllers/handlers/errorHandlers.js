const AppError = require("../../utils/appError");
module.exports = function mainErrorController(err, req, res, next) {
  /**
   * if not operational - not handled:
   *    these errors that occures from [mongodb, internal express errors, these UNKNOWN/uncontrolled errors !!];
   *    or the errors that happens without using the new AppError(errMsg, errStatusCode);
   * then we can handle them:
   * 01 manually by selecting/checking the error name && if matched then our specific action/handler;
   * 02 we can handle them by a global message depend on the current NODE_ENV:
   *    01 for the dev mode - show the entire [error, stack];
   *    02 for the prod mode - send only global non-technical message;
   *
   */
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

  /*
   * if operational/handled then send the error in both [production, in dev]
   * else - then send only the production mode for end-users:
   *
   */
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
  err.statusCode = 500;
  err.status = "error";
  err.isOperational = "yep";
  return err;
}
function globalHandlerPro() {
  return new AppError("Something went wrong!", 500);
}
