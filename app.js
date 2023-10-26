const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { celebrate, Joi } = require("celebrate");
const { login, postUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
//const ServerError = require("./middlewares/ServerError");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

const { NotFound } = require("./utils/constants");
const { linkRegex } = require("./utils/constants");

const { PORT = 3000, MONGO_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  "/signin",
  auth,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  auth,
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
//app.use(auth);

app.use("/users", routerUsers);
app.use("/cards", routerCards);
app.use("*", (req, res) => {
  res.status(NotFound).send({ message: "Страница не найдена" });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

async function init() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected DB");
  await app.listen(PORT);
  console.log(`Listen on ${PORT} port`);
}

init();
