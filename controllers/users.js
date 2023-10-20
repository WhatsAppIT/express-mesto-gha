const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const key = require("../utils/constants");
const authError = require("../errors/authError");
const {
  ValidationError,
  NotFound,
  ServerError,
} = require("../utils/constants");

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден.");
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при поиске пользователя."
          )
        );
      }

      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new authError("Неправильный логин или пароль");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new authError("Неправильный логин или пароль");
        }
        const token = jwt.sign({ _id: user._id }, key, { expiresIn: "7d" });
        res
          .cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
          })
          .end();
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(ServerError)
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
        .status(NotFound)
        .send({ message: "Пользователь по указанному _id не найден." });
    }

    if (error.name === "CastError") {
      return res.status(ValidationError).send({
        message: "Переданы некорректные данные при поиске пользователя.",
      });
    }

    return res
      .status(ServerError)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const postUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.send(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(ValidationError).send({
        message: "Переданы некорректные данные при создании пользователя.",
      });
    }

    return res
      .status(ServerError)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const patchUsersMe = async (req, res) => {
  try {
    const { name, about } = req.body;
    const patchUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        about,
      },
      { new: true, runValidators: true }
    );

    if (!patchUser) {
      throw new Error("NotFoundUser");
    }

    return res.send(patchUser);
  } catch (error) {
    if (error.message === "NotFoundUser") {
      return res
        .status(NotFound)
        .send({ message: "Пользователь по указанному _id не найден." });
    }
    if (error.name === "ValidationError") {
      return res.status(ValidationError).send({
        message: "Переданы некорректные данные при поиске пользователя.",
      });
    }

    return res
      .status(ServerError)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const patchUsersMeAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const patchAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!patchAvatar) {
      throw new Error("NotFoundError");
    }

    return res.send(patchAvatar);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(ValidationError).send({
        message: "Переданы некорректные данные при поиске аватара.",
      });
    }
    if (error.message === "NotFoundError") {
      return res
        .status(NotFound)
        .send({ message: "Aватар по указанному _id не найден." });
    }

    return res
      .status(ServerError)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

module.exports = {
  getMe,
  login,
  getUsers,
  getUserId,
  postUser,
  patchUsersMe,
  patchUsersMeAvatar,
};

/* app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if(!user){
        return Promise.reject(new Error('Неправельные почта или пароль'))
      }

    return bcrypt.compare(password, user.password)
    })
    .then((matched) => {
    if(!matched) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    res.send({ message: 'все верно' })
  })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}); */
