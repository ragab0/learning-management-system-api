const AppError = require("../utils/appError");
module.exports = function mainErrorController(err, req, res, next) {
  /**
   * if not operational - not handled:
   *    >> these errors that occures from [mongodb, internal express errors, these UNKNOWN/uncontrolled errors !!];
   *    >> the errors that happens without using the new AppError(errMsg, errStatusCode);
   * 01 then we can handle them manually by selecting/checking the error name && if matched then our specific action/handler;
   * 02 we can handle them by a global message depend on the current NODE_ENV (dev, prod):
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
   * if operational - handled:
   * >> if we are in the development mode:
   *    01 then send the error in production
   *    02 more options for us - the developers like [the err itself && the err.stack/history];
   * >> else - in the production mode:
   *    -- then send only the production form - the final form for end-users;
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
