const User = require("../models/user.js");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      return res.status(500).send("Ошибка со стороны сервера.");
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      return res.status(500).send({ message: "Ошибка со стороны сервера." });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Пользователь по указанному _id не найден.",
        });
      }
      return res.status(500).send({ message: "Ошибка со стороны сервера." });
    });
};

const patchUsersMe = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Пользователь по указанному _id не найден.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      res.status(500).send({ message: "Ошибка в обновлении профиля" });
    });
};

const patchUsersMeAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Пользователь с указанным _id не найден.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      res.status(500).send({ message: "Ошибка в обновлении профиля" });
    });
};

module.exports = {
  getUsers,
  getUserId,
  postUser,
  patchUsersMe,
  patchUsersMeAvatar,
};
