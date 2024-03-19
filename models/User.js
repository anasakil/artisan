const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  paypalEmail: { type: String, required: false }, // Optional, only for sellers 
},
  { timestamps: true });

module.exports = mongoose.model('User', userSchema);
