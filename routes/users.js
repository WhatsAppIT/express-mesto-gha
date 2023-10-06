const router = require('express').Router();
const {
  getUsers,
  getUserId,
  postUser,
  patchUsersMe,
  patchUsersMeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', postUser);
router.patch('/me', patchUsersMe);
router.patch('/me/avatar', patchUsersMeAvatar);

module.exports = router;
