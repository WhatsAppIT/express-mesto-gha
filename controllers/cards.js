const Card = require("../models/card");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/ValidationError");
const DeleteCardError = require("../errors/DeleteCardError");

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

const deleteCardId = (req, res, next) => {
  const owner = req.user._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка по указанному _id не найдена.");
      }
      if (card.owner.toString() !== owner) {
        throw new DeleteCardError("Нельзя удалить данную карточку.");
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((myCard) => {
      res.send(myCard);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new ValidationError(
            "Переданы некорректные данные при поиске карточки."
          )
        );
      }
      return next(err);
    });
};

const deleteCardsIdLikes = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий id карточки");
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные для постановки/снятии лайка."
          )
        );
      } else if (err.kind === "ObjectId") {
        next(new ValidationError("Некорректный формат id."));
      } else {
        next(err);
      }
    });
};

const putCardsIdLikes = async (req, res, next) => {
  try {
    const putLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!putLike) {
      throw new NotFoundError("Карточка с указанным _id не найден.");
    }

    return res.send(putLike);
  } catch (err) {
    if (err.name === "CastError") {
      return next(
        new ValidationError("Переданы некорректные данные для снятия лайка.")
      );
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
