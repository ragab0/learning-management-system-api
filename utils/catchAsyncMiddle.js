// a catchAsyncMiddle for req-res middles;

module.exports = function catchAsyncMiddle(middle) {
  return function mutatedMiddle(req, res, next) {
    try {
      middle(req, res, next);
    } catch (error) {
      // next(error);
    }
  };
};
