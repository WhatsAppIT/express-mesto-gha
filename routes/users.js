const router = require("express").Router();
const {
  getUsers,
  getUserId,
  getProfile,
  patchUsersMe,
  patchUsersMeAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserId);
router.get("/me", getProfile);
router.patch("/me", patchUsersMe);
router.patch("/me/avatar", patchUsersMeAvatar);

module.exports = router;
