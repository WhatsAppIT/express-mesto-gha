const Card = require("../models/card.js");

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      return res.status(500).send("Ошибка со стороны сервера.");
    });
};

const postCard = (req, res) => {
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

const deleteCardId = (req, res) => {
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
};

const deleteCardsIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Карточка с указанным _id не найдена.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для снятии лайка. ",
        });
      }

      return res.status(500).send("Ошибка со стороны сервера.");
    });
};

const putCardsIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({
          message: "Карточка с указанным _id не найдена.",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для снятия лайка. ",
        });
      }
      return res.status(500).send("Ошибка со стороны сервера.");
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCardId,
  deleteCardsIdLikes,
  putCardsIdLikes,
};
