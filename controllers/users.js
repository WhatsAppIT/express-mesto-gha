const User = require('../models/user');

const {
  ValidationError = 400,
  NotFoundError = 404,
  ServerError = 500,
} = process.env;

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
        .status(NotFoundError)
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
    );

    if (!patchUser) {
      throw new Error('NotFoundUser');
    }

    return res.send(patchUser);
  } catch (error) {
    if (error.message === 'NotFoundUser') {
      return res
        .status(NotFoundError)
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
    );

    if (!patchAvatar) {
      throw new Error('NotFoundErr');
    }

    return res.send(patchAvatar);
  } catch (error) {
    if (error.name === 'ValidationErr') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные при поиске аватара.',
      });
    }
    if (error.message === 'NotFoundErr') {
      return res
        .status(NotFoundError)
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
