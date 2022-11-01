const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name cannot be blank"],
    trim: true,
    maxlength: [20, "User name cannot be max than 20 character"],
    minlength: [3, "User name cannot be less than 3 character"],
  },
  email: {
    type: String,
    required: [true, "User email cannot be blank"],
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    maxlength: [20, "User name cannot be max than 20 character"],
    minlength: [3, "User name cannot be less than 3 character"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password cannot be blank"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm password cannot be blank"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and confirm password not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  // only run this function if password modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
