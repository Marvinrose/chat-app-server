const jwt = require("jsonwebtoken");

const otpGenerator = require("otp-generator");

const crypto = require("crypto");

// const mailService = require("../services/mailer");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

// Signup => register - sendOTP - verifyOTP

const User = require("../models/user");
const filterObject = require("../utils/filterObj");
const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");

// Register new user
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const filteredBody = filterObject(
    req.body,
    "firstName",
    "lastName",
    "password",
    "email"
  );

  //   check if a verified user with given email exists
  const existing_user = await User.findOne({ email: email });

  if (existing_user && existing_user.verified) {
    res.status(400).json({
      status: "error",
      message: "User already exists! Please login",
    });
  } else if (existing_user) {
    await User.findOneAndUpdate({ email: email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    req.userId = existing_user._id;
    next();
  } else {
    // If user record is not available in DB
    const new_user = await User.create(filteredBody);

    // generate otp and send email to the user
    req.userId = new_user._id;
    next();
  }
};

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const otp_expiry_time = Date.now() + 10 + 60 * 1000; // 10 mins after otp is sent

  const user = await User.findByIdAndUpdate(
    userId,
    {
      otp: new_otp,
      otp_expiry_time: otp_expiry_time,
    },
    { new: true }
  );

  // user.otp = new_otp.toString();

  // await user.save({ new: true, validateModifiedOnly: true });

  // TODO => Send Mail

  // mailService.sendEmail({
  //   from: "rozzeymarvin32@gmail.com",
  //   to: "example@gmail.com",
  //   subject: "otp for tawk",
  //   text: `Your OTP is ${new_otp}, valid for 10 minutes..`,
  // });
  // .then(() => {
  //   res.status(200).json({
  //     status: "success",
  //     message: "Message sent successfully!",
  //   });
  // })
  // .catch((err) => {
  //   res.status(500).json({
  //     status: "error",
  //     message: "Oops! Something went wrong...",
  //   });
  // });

  res.status(200).json({
    status: "success",
    message: "Otp sent successfully!",
  });
  console.log("otppp", new_otp);
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  // verify otp and update user record accordingly

  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Email is invalid or otp expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect..",
    });
    return;
  }

  // OTP is correct

  user.verified = true;
  user.otp = undefined;

  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
  });
});

// User Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Both email and password are required",
    });
  }

  const userDoc = await User.findOne({ email: email }).select("+password");

  if (
    !userDoc ||
    !(await userDoc.correctPassword(password, userDoc.password))
  ) {
    res.status(400).json({
      status: "error",
      message: "Email or password is incorrect",
    });
  }

  const token = signToken(userDoc._id);

  res.status(200).json({
    status: "success",
    message: "Logged In Successfully",
    token,
  });
};

exports.protect = async (req, res, next) => {
  // Getting token (JWT) and check if its there

  let token;

  // 'Bearer hjkkjijuihgftgfyuijk'

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    res.status(400).json({
      status: "error",
      message: "You are not logged in.. Please log in to get access!",
    });
    return;
  }

  // Verification of token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists

  const this_user = await User.findById(decoded.userId);

  if (!this_user) {
    res.status(400).json({
      status: "error",
      message: "This user doesn't exist",
    });
  }

  // Check if user changed their password after token was issued

  if (this_user.changedPasswordAfter(decoded.iat)) {
    res.status(400).json({
      status: "error",
      message: "User recently updated password.. Please log In!",
    });
  }

  req.user = this_user;
  next();
};

// Types of

exports.forgotPassword = async (req, res, next) => {
  // Get user email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with given email address",
    });
  }

  // Generate the random reset token

  const resetToken = user.createPasswordResetToken();

  const resetURL = `https://chat-app-lovat-six.vercel.app/auth/reset-password/?code=${resetToken}`;

  try {
    // TODO => Send email with reset url
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: "error",
      message: "There was an error sending the email.. Please try again later!",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  // Get the user based on token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired and there is a user, set the new password

  if (!user) {
    res.status(400).json({
      status: "error",
      message: "Token is invalid or expired!",
    });
    return;
  }

  // Update users password and set reset token and expiry to undefined

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Login the user and send new JWT

  // TODO => Send an email to the user informing the user about password reset

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password Reset Successfull!",
    token,
  });
};
