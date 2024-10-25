function sendResults(res, results, page, totalPages) {
  res.status(200).json({
    status: "success",
    results,
    page,
    totalPages,
    count: results?.length || 0,
  });
}

function sendResult(res, result, statusCode) {
  res.status(statusCode || result ? 200 : 204).json({
    status: "success",
    result,
  });
}

module.exports = {
  sendResult,
  sendResults,
};
