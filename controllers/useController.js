const User = require("../models/userModel");
const catchAsync = require("../utils/catchasync");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 200,
    data: users,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 500,
    message: "Route not defined! Please try after sometime",
  });
};
