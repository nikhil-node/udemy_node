const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please enter email and password"));
  }
  const userData = await User.findOne({ email }).select("+password");

  if (
    !userData ||
    !(await userData.correctPassword(password, userData.password))
  ) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = signToken(userData._id);

  res.status(200).json({
    status: "Success",
    token,
  });
});

//Middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }
  //Verify jwt token string
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const checkUser = await User.findById(decode.id);
  if (!checkUser) {
    return next(new AppError("User not exists which beloged to current token"));
  }
  // check password last changed
  if (checkUser.changePasswordAfter(decode.iat)) {
    return next(new AppError("User recently changed password"));
  }
  next();
});
