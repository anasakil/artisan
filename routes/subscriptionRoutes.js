const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {createStripeSubscription , getAllSubscriptions} = require('../controllers/subscriptionController');

const router = express.Router();


router.get('/subscribe', protect, restrictTo('admin'), getAllSubscriptions);



router.post('/stripe/create', protect, restrictTo('seller'), createStripeSubscription);


module.exports = router;
