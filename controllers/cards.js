const Card = require("../models/card.js");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "getError") {
        return res
          .status(400)
          .send({
            message: "Переданы некорректные данные при создании карточки.",
          });
      }
      return res.status(500).send("Ошибка по умолчанию.");
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "postError") {
        return res
          .status(400)
          .send({
            message: "Переданы некорректные данные при создании карточки.",
          });
      }
      return res.status(500).send("Ошибка по умолчанию.");
    });
};

const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "cardError") {
        return res.status(404).send({ message: "Ошибка в получении карточки" });
      }
      return res.status(500).send("Ошибка по умолчанию.");
    });
};

const deleteCardsIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "someError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для снятии лайка. ",
        });
      }
      return res.status(500).send("Ошибка по умолчанию.");
    });
};

const putCardsIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "someError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка. ",
        });
      }
      return res.status(500).send("Ошибка по умолчанию.");
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCardId,
  deleteCardsIdLikes,
  putCardsIdLikes,
};

/* .then((card) => res.send({ data: card })) */
