const ValidationError = 400;
const NotFound = 404;
const ServerError = 500;
const MONGO_DUBLICATE_ERROR_CODE = 11000;
const key = "d285e3dceed844f902650f40";

const linkRegex =
  /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/im;

module.exports = {
  key,
  ValidationError,
  NotFound,
  ServerError,
  linkRegex,
  MONGO_DUBLICATE_ERROR_CODE,
};
