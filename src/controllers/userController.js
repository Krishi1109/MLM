const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/ErrorMiddleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");
const bcrypt = require("bcrypt");

exports.newUser = catchAsyncErrors(async (req, res, next) => {
  // Input Data
  const { username, password } = req.body;

  // Is username is already taken or not
  const isTaken = await User.findOne({ username });
  if (isTaken) {
    return next(new ErrorHandler(`This Username is not available..!`));
  }

  // referance Id
  const referance = req.loginUser._id;

  // Parent Id
  const parent = await User.findOne({ children: { $gt: 0 } });

  const children = parent.children - 1;
  // Update parent values
  const update = await User.findByIdAndUpdate(
    parent._id,
    { children },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  const newUser = await User.create({
    username,
    password,
    referance,
    parent: parent._id,
  });
  if (newUser) {
    res.status(200).json({
      success: true,
      message: "User Added Succesfully",
      result: newUser,
    });
  }
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.login_token;

  if (token) {
    return res
      .status(422)
      .send({ status: false, message: "You Are Already Loggedin" });
  } else {
    const { username, password } = req.body;
    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid Email or Password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid Credentials" });
    }

    let token = await user.generateAuthToken();
    res.cookie("login_token", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });

    return res.status(200).send({
      success: true,
      message: "Login successfull..!",
      login_token: token,
      result: user,
    });
  }
});

exports.myReferance = catchAsyncErrors(async (req,res,next) => {
    const data = await User.find({referance : req.loginUser._id})
    console.log(data)
    res.status(200).send({
        success : true,
        message : "Successfully fetch data",
        total_referances : data.length,
        result : data
    })
})

exports.myChildren = catchAsyncErrors(async(req,res,next) => {
    const data = await User.find({parent: req.loginUser._id})
    console.log(data)
    res.status(200).send({
        success : true,
        message : "Successfully fetch data",
        total_referances : data.length,
        result : data
    })
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("login_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });
