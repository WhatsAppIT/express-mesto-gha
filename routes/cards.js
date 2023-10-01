const router = require("express").Router();
const {
  getCards,
  postCard,
  deleteCardId,
  putCardIdLikes,
  deleteCardIdLikes,
} = require("../controllers/cards.js");

router.get("/", getCards);
router.post("/", postCard);
router.delete("/:cardId", deleteCardId);
router.put("/:cardId/likes", putCardIdLikes);
router.delete("/:cardId/likes", deleteCardIdLikes);

module.exports = router;
