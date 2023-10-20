const router = require("express").Router();
const {
  getUsers,
  getUserId,
  getMe,
  patchUsersMe,
  patchUsersMeAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserId);
router.patch("/me", patchUsersMe);
router.patch("/me/avatar", patchUsersMeAvatar);
router.get("/me", getMe);

module.exports = router;
