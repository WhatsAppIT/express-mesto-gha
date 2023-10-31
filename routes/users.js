const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { linkRegex } = require("../utils/constants");
const {
  getUsers,
  getUserId,
  getProfile,
  patchUsersMe,
  patchUsersMeAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getProfile);
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUserId
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  patchUsersMe
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(linkRegex),
    }),
  }),
  patchUsersMeAvatar
);

module.exports = router;
