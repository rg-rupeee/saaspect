const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

const Costumer = require("./../model/costumerModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const newCostumer = await Costumer.create(req.body);

  // signing jwt
  const token = jwt.sign({ id: newCostumer._id }, process.env.JWT_SECRET);

  newCostumer.password = undefined;

  return res.status(201).json({
    status: "success",
    token,
    costumer: newCostumer,
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(new AppError("please provide email", 400));
  }

  if (!password) {
    return next(new AppError("please provide password", 400));
  }

  const costumer = await Costumer.findOne({ email });
  // console.log(costumer);

  // if no costumer found with that email
  if (!costumer) {
    return next(new AppError("email not registered"));
  }

  //  check if provided password is correct
  if (!(await bcrypt.compare(password, costumer.password))) {
    return next(new AppError("incorrect password", 401));
  }

  // signing jwt
  const token = jwt.sign({ id: costumer._id }, process.env.JWT_SECRET);

  costumer.password = undefined;
  return res.status(200).json({
    status: "success",
    token,
    costumer,
  });
});

exports.check = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  //  if token not found
  if (!token) {
    return next(new AppError("please sign in i.e provide a token", 401));
  }

  // verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if costumer exists
  const costumer = await Costumer.findById(decoded.id);

  // check if costumer exists
  if (!costumer) {
    return next(
      new AppError("costumer belonging to this jwt token does not exists")
    );
  }

  // console.log(costumer);

  // add user to req for future reference to costumer
  req.user = costumer;

  // grant access to protected route
  next();
});
