const router = require('express').Router();
const {
  getCards,
  postCard,
  deleteCardId,
  putCardsIdLikes,
  deleteCardsIdLikes,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', postCard);
router.delete('/:cardId', deleteCardId);
router.put('/:cardId/likes', putCardsIdLikes);
router.delete('/:cardId/likes', deleteCardsIdLikes);

module.exports = router;
