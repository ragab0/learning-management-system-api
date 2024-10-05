module.exports = function Logger(req, _, next) {
  console.log("The server is hitted by", req.url);
  next();
};
