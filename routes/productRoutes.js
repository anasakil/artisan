const express = require('express');
const { listProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, restrictTo, optionalAuth } = require('../middleware/authMiddleware');


const router = express.Router();

router.route('/')
    .get( optionalAuth, listProducts)
    .post(protect, restrictTo('seller'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, restrictTo('seller'), updateProduct)
    .delete(protect, restrictTo('seller'), deleteProduct);

module.exports = router;
