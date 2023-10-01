const Card = require("../models/card.js");

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: "Ошибка в получении всех карточек" });
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: "Ошибка в создании карточки" })
    );
};

module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: "Ошибка удаления карточки по _id" })
    );
};

module.exports.deleteCardIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: "Ошибка удаления лайка" }));
};

module.exports.putCardIdLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(500).send({ message: "Ошибка добавления лайка" })
    );
};
