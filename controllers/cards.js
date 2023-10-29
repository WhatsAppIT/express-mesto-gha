const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/ValidationError");
const DeleteCardError = require("../errors/DeleteCardError");
/* const {
  ValidationError,
  NotFound,
  ServerError,
} = require("../utils/constants"); */

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при создании карточки."
          )
        );
      }
      return next(err);
    });
};

const deleteCardId = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const card = await Card.findByIdAndRemove(req.params.cardId);
    const cardOwner = await Card.findById(req.params.cardId);
    if (!card) {
      throw new Error("NotFound");
    }
    if (card.owner.toString() !== owner) {
      throw new Error("CardOwnerError");
    }
    res.send(cardOwner);
    res.send(card);
  } catch (err) {
    if (err.message === "CardOwnerError") {
      return next(new DeleteCardError("Нельзя удалить данную карточку."));
    }
    if (err.message === "NotFound") {
      return next(new NotFoundError("Карточка по указанному _id не найден."));
    }

    if (err.name === "CastError") {
      return next(
        new ValidationError("Переданы некорректные данные при поиске карточки.")
      );
    }

    return next(err);
  }
};

const deleteCardsIdLikes = async (req, res, next) => {
  try {
    const deleteLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!deleteLike) {
      throw new Error("NotFound");
    }

    return res.send(deleteLike);
  } catch (err) {
    if (err.message === "NotFound") {
      return next(new NotFoundError("Карточка с указанным _id не найден."));
    }
    if (err.kind === "ObjectId") {
      return next(
        new ValidationError("Переданы некорректные данные для снятия лайка.")
      );
    }

    return next(err);
  }
};

const putCardsIdLikes = async (req, res, next) => {
  try {
    const putLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!putLike) {
      throw new Error("NotFound");
    }

    return res.send(putLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return next(
        new ValidationError("Переданы некорректные данные для снятия лайка.")
      );
    }
    if (err.message === "NotFound") {
      return next(new NotFoundError("Карточка с указанным _id не найден."));
    }

    return next(err);
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCardId,
  deleteCardsIdLikes,
  putCardsIdLikes,
};
