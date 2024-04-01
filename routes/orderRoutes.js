const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/buyer', protect, orderController.placeOrder);
router.get('/buyer/myorders', protect, orderController.viewOrderHistory);
router.put('/buyer/orders/:orderId', protect, orderController.updateBuyerOrder);
router.delete('/buyer/orders/:orderId', protect, orderController.deleteBuyerOrder);




router.get('/seller/orders', protect, restrictTo('seller'), orderController.getSellerOrders);
router.put('/seller/orders/:orderId', protect, restrictTo('seller'), orderController.updateSellerOrder);
router.delete('/seller/orders/:orderId', protect, restrictTo('seller'), orderController.deleteSellerOrder)

module.exports = router;
