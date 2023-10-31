require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { celebrate, Joi, errors } = require("celebrate");
const { login, postUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const NotFoundError = require("./errors/NotFoundError");
//const ServerError = require("./errors/ServerError");
const { linkRegex } = require("./utils/constants");

const { PORT = 3000, MONGO_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use("/users", auth, routerUsers);
app.use("/cards", auth, routerCards);
app.use("*", auth, (req, res) => {
  return res.status(404).send("Страница не найдена");
});

app.use(errors());

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: err.message });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});

async function init() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected DB");
  await app.listen(PORT);
  console.log(`Listen on ${PORT} port`);
}

init();
