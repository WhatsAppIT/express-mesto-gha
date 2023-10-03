const User = require("../models/user.js");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: "Ошибка в получении всех пользователей" });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const err = new Error("Ошибка в получении пользователя по _id");
        err.name = "userNotFound";
        throw err;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "userError") {
        res
          .status(500)
          .send({ message: "Ошибка в получении пользователя по _id" });
      }
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Ошибка в создании пользователя" })
    );
};

module.exports.patchUsersMe = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Ошибка в обновлении профиля" })
    );
};

module.exports.patchUsersMeAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: "Ошибка в обновлении аватара" })
    );
};
