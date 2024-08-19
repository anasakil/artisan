const User = require('../models/User');
const Subscription = require('../models/Subscription');  
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role ,imageUrl} = req.body;

  if (!email || !password || !username) {
    res.status(400).send('Please add all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
    imageUrl,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send('Invalid user data');
  }
});


exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      paypalEmail: user.paypalEmail,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
});



exports.getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const subscription = await Subscription.findOne({ seller: userId }).sort({ endDate: -1 }).limit(1);

  const userProfile = user.toObject(); 
  userProfile.subscriptionStatus = subscription ? subscription.status : 'No subscription';

  res.json(userProfile);
});


exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.imageUrl = req.body.imageUrl || user.imageUrl; 


    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      password: updatedUser.password,
      imageUrl: updatedUser.imageUrl, 
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// Forgot Password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User with this email does not exist' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetPasswordExpire;

    await user.save();

    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within ten minutes of receiving it:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Email could not be sent');
      }
      res.status(200).json({ msg: 'Email sent' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


exports.resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

    // Hash du nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Supprimez le token de réinitialisation et la date d'expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Sauvegardez l'utilisateur avec le nouveau mot de passe
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
