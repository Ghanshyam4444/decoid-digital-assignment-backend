const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "BACKEND ERROR";
  const extradetail = err.extradetail || "ERROR FROM BACKEND";
  return res.status(status).json({ message, extradetail });
};
module.exports = errorMiddleware;
