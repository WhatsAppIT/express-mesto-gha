const ValidationError = 400;
const NotFound = 404;
const ServerError = 500;
const MONGO_DUBLICATE_ERROR_CODE = 11000;

const linkRegex =
  /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/im;

module.exports = {
  ValidationError,
  NotFound,
  ServerError,
  linkRegex,
  MONGO_DUBLICATE_ERROR_CODE,
};
