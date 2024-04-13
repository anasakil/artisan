const express = require('express');
const router = express.Router();
const { listProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, restrictTo, optionalAuth ,getProductsByRegion} = require('../middleware/authMiddleware');
const productsController = require('../controllers/productController'); 

router.get('/:region', productsController.getProductsByRegion);

router.route('/')
    .get( optionalAuth, listProducts)
    .post(protect, restrictTo('seller'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, restrictTo('seller'), updateProduct)
    .delete(protect, restrictTo('seller'), deleteProduct);

module.exports = router;
