const ValidationError = 400;
const NotFound = 404;
const ServerError = 500;
const MONGO_DUBLICATE_ERROR_CODE = 11000;

const linkRegex =
  /^http?:\/\/(www\.)?[0-9a-zA-Z]+([.|-]{1}[0-9a-zA-Z]+)*\.[0-9a-zA-Z-]+(\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;

module.exports = {
  ValidationError,
  NotFound,
  ServerError,
  linkRegex,
  MONGO_DUBLICATE_ERROR_CODE,
};
