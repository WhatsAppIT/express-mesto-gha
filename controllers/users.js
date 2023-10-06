const User = require("../models/user.js");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error("NotFound");
    }

    return res.send(user);
  } catch (error) {
    if (error.message === "NotFound") {
      return res
        .status(404)
        .send({ message: "Пользователь по указанному _id не найден." });
    }

    if (error.name === "CastError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при поиске пользователя.",
      });
    }

    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.send(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send({
        message: "Переданы некорректные данные при создании пользователя.",
      });
    }

    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const patchUsersMe = async (req, res) => {
  try {
    const { name, about } = req.body;
    const patchUser = await User.findByIdAndUpdate(req.user._id, {
      name,
      about,
    });

    if (!patchUser) {
      throw new Error("NotFoundUser");
    }

    return res.status(200).send(patchUser);
  } catch (error) {
    if (error.message === "NotFoundUser") {
      return res
        .status(404)
        .send({ message: "Пользователь по указанному _id не найден." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при поиске пользователя.",
      });
    }

    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const patchUsersMeAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const patchAvatar = await User.findByIdAndUpdate(req.params.id, { avatar });

    if (!patchAvatar) {
      throw new Error("NotFoundError");
    }

    return res.send(patchAvatar);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при поиске аватара.",
      });
    }
    if (error.message === "NotFoundError") {
      return res
        .status(404)
        .send({ message: "Aватар по указанному _id не найден." });
    }

    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

module.exports = {
  getUsers,
  getUserId,
  postUser,
  patchUsersMe,
  patchUsersMeAvatar,
};

/* const postUser = (req, res) => {
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
}; */
/* const patchUsersMeAvatar = (req, res) => {
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
}; */

/* const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id в БД не найден." });
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


    if (!user) {
      throw new Error("NotFound");
    }
};



/* const patchUsersMe = (req, res) => {
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
}; */
