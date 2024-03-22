const express = require('express');
const router = express.Router();

const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

//  routes
router.route('/').post(protect, addOrderItems).get(protect, restrictTo, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;

