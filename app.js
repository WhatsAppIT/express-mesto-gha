require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { celebrate, Joi, errors } = require("celebrate");
const { login, postUser } = require("./controllers/users");
const { reqLogger, errorLogger } = require("./middlewares/logger");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const NotFoundError = require("./errors/NotFoundError");
const { linkRegex } = require("./utils/constants");

const { PORT = 3001, MONGO_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(reqLogger);

app.use(
  "/signin",

  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.use(
  "/signup",

  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(linkRegex),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  postUser
);
app.use(auth);
app.use("/users", routerUsers);

app.use("/cards", routerCards);

app.use("*", (req, res, next) =>
  next(new NotFoundError("Страница не найдена"))
);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

async function init() {
  await mongoose.connect(MONGO_URL);
  console.log(MONGO_URL);
  await app.listen(PORT);
  console.log(PORT);
}

init();
