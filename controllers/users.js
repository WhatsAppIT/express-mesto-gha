const User = require('../models/user');
const {
  ValidationError,
  NotFound,
  ServerError,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error('NotFound');
    }

    return res.send(user);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res
        .status(NotFound)
        .send({ message: 'Пользователь по указанному _id не найден.' });
    }

    if (error.name === 'CastError') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные при поиске пользователя.',
      });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

const postUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.send(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
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
      { new: true, runValidators: true },
    );

    if (!patchUser) {
      throw new Error('NotFoundUser');
    }

    return res.send(patchUser);
  } catch (error) {
    if (error.message === 'NotFoundUser') {
      return res
        .status(NotFound)
        .send({ message: 'Пользователь по указанному _id не найден.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные при поиске пользователя.',
      });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

const patchUsersMeAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const patchAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!patchAvatar) {
      throw new Error('NotFoundError');
    }

    return res.send(patchAvatar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные при поиске аватара.',
      });
    }
    if (error.message === 'NotFoundError') {
      return res
        .status(NotFound)
        .send({ message: 'Aватар по указанному _id не найден.' });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

module.exports = {
  getUsers,
  getUserId,
  postUser,
  patchUsersMe,
  patchUsersMeAvatar,
};
