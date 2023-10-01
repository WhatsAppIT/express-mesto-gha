const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const { PORT = 5000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "65167ec131008aa2bfb9cb69", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/users", routerUsers);
app.use("/cards", routerCards);

async function init() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mestodb");
  console.log("DB CONNECT");

  await app.listen(PORT);
  console.log(`Server listen on port ${PORT}`);
}

init();
