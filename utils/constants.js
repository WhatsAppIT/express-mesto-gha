const ValidationError = 400;
const NotFound = 404;
const ServerError = 500;
const key = "d285e3dceed844f902650f40";
const linkRegex =
  /^https?:\/\/(www\.)?[0-9a-zA-Z]+([.|-]{1}[0-9a-zA-Z]+)*\.[0-9a-zA-Z-]+(\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;

module.exports = {
  key,
  ValidationError,
  NotFound,
  ServerError,
  linkRegex,
};
