const User = require('../models/User');
const Subscription = require('../models/Subscription');  

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

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      password: updatedUser.password,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
