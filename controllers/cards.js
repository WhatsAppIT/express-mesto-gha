const Card = require('../models/card');
const {
  ValidationError,
  NotFound,
  ServerError,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ValidationError).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res
        .status(ServerError)
        .send({ message: 'Ошибка со стороны сервера.', error });
    });
};

const deleteCardId = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (!card) {
      throw new Error('NotFound');
    }

    return res.send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res
        .status(NotFound)
        .send({ message: 'Карточка по указанному _id не найдена.' });
    }

    if (error.name === 'CastError') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные при поиске карточки.',
      });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

const deleteCardsIdLikes = async (req, res) => {
  try {
    const deleteLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!deleteLike) {
      throw new Error('NotFound');
    }

    return res.send(deleteLike);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(NotFound).send({
        message: 'Карточка с указанным _id не найдена.',
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные для снятия лайка.',
      });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

const putCardsIdLikes = async (req, res) => {
  try {
    const putLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!putLike) {
      throw new Error('NotFound');
    }

    return res.send(putLike);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(ValidationError).send({
        message: 'Переданы некорректные данные для снятия лайка.',
      });
    }
    if (error.message === 'NotFound') {
      return res.status(NotFound).send({
        message: 'Карточка с указанным _id не найдена.',
      });
    }

    return res
      .status(ServerError)
      .send({ message: 'Ошибка на стороне сервера', error });
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCardId,
  deleteCardsIdLikes,
  putCardsIdLikes,
};
