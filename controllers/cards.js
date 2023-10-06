const Card = require("../models/card.js");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      }
      return res
        .status(500)
        .send({ message: "Ошибка со стороны сервера.", error });
    });
};

const deleteCardId = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (!card) {
      throw new Error("NotFound");
    }

    return res.send(card);
  } catch (error) {
    if (error.message === "NotFound") {
      return res
        .status(404)
        .send({ message: "Карточка по указанному _id не найдена." });
    }

    if (error.name === "CastError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при поиске карточки.",
      });
    }

    return res
      .status(500)
      .send({ message: "Ошибка на стороне сервера", error });
  }
};

const deleteCardsIdLikes = async (req, res) => {
  try {
    const deleteLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true, runValidators: true }
    );

    if (!deleteLike) {
      throw new Error("NotFound");
    }

    return res.send(deleteLike);
  } catch (error) {
    if (error.message === "NotFound") {
      return res.status(404).send({
        message: "Карточка с указанным _id не найдена.",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные для снятии лайка. ",
      });
    }

    return res.status(500).send("Ошибка со стороны сервера.");
  }
};

const putCardsIdLikes = async (req, res) => {
  try {
    const putLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true }
    );

    if (!putLike) {
      throw new Error("NotFound");
    }

    return res.send(putLike);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные для снятия лайка. ",
      });
    }
    if (error.message === "NotFound") {
      return res.status(404).send({
        message: "Карточка с указанным _id не найдена.",
      });
    }

    return res.status(500).send("Ошибка со стороны сервера.");
  }
};

module.exports = {
  getCards,
  postCard,
  deleteCardId,
  deleteCardsIdLikes,
  putCardsIdLikes,
};

/* const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      }
      return res.status(500).send("Ошибка со стороны сервера.");
    });
};

/* const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      return res.status(500).send("Ошибка со стороны сервера.");
    });
};
/* const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Карточка с указанным _id не найдена.",
        });
      }
      return res.status(500).send("Ошибка со стороны сервера.");
    });
}; */
