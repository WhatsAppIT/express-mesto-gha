const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const AuthError = require("../errors/AuthError");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: [2, "минимальная длинна 2 символа"],
      maxlength: 30,
    },

    about: {
      type: String,
      default: "Исследователь",
      minlength: 2,
      maxlength: 30,
    },

    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: "Неправильный формат почты",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError("Неправильная почта или пароль.");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError("Неправильная почта или пароль.");
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
