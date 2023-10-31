const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) {
    return res.status(500).send({ message: err.message });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};

module.exports = errorHandler;