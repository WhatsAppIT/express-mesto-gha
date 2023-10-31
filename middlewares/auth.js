const jwt = require('jsonwebtoken');
const SigninError = require('../errors/SigninError');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new SigninError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new SigninError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
