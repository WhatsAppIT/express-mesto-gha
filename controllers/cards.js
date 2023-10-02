const Card = require("../models/card.js");

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === "cardError") {
        res.status(404).send({ message: "Ошибка в получении карточки" });
        return;
      }
      res.status(500).send("Произошла ошибка на сервере");
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "postError") {
        res.status(400).send({ message: "Ошибка в создании карточки" });
        return;
      }
      res.status(500).send("Произошла ошибка на сервере");
    });
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "cardError") {
        res.status(404).send({ message: "Ошибка в получении карточки" });
        return;
      }
      res.status(500).send("Произошла ошибка на сервере");
    });
};

module.exports.deleteCardIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "cardError") {
        res.status(404).send({ message: "Ошибка в получении карточки" });
        return;
      }
      res.status(500).send("Произошла ошибка на сервере");
    });
};

module.exports.putCardIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "cardError") {
        res.status(404).send({ message: "Ошибка в получении карточки" });
        return;
      }
      res.status(500).send("Произошла ошибка на сервере");
    });
};
