const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {createStripeSubscription } = require('../controllers/subscriptionController');

const router = express.Router();

router.use(protect, restrictTo('seller'));
router.post('/stripe/create', createStripeSubscription);


module.exports = router;
