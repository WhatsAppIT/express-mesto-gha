const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const {
  NotFound,
} = require('./utils/constants');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '65167ec131008aa2bfb9cb69', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'Страница не найдена' });
});

async function init() {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);
}

init();
