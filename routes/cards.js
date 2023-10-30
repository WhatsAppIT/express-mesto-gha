const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { linkRegex } = require("../utils/constants");
const {
  getCards,
  postCard,
  deleteCardId,
  putCardsIdLikes,
  deleteCardsIdLikes,
} = require("../controllers/cards");

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(linkRegex),
    }),
  }),
  postCard
);
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.objectId(),
    }),
  }),
  deleteCardId
);
router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.objectId(),
    }),
  }),
  putCardsIdLikes
);
router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.objectId(),
    }),
  }),
  deleteCardsIdLikes
);

module.exports = router;
