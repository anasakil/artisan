const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.post('/forgotPassword', forgotPassword); 
router.put('/resetPassword/:resetToken', resetPassword); 

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

module.exports = router;
