const express = require('express');
const router = express.Router();
const { listProducts, createProduct, getProductById, updateProduct, deleteProduct ,listProductsForSeller ,getProductsByCategory} = require('../controllers/productController');
const { protect, restrictTo, optionalAuth } = require('../middleware/authMiddleware');
const productsController = require('../controllers/productController'); 


router.get('/my-products', protect, restrictTo('seller'), listProductsForSeller);

router.get('/:region', productsController.getProductsByRegion);
router.get('/category/:categoryId', getProductsByCategory);


router.route('/')
    .get( optionalAuth, listProducts)
    .post(protect, restrictTo('seller'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, restrictTo('seller'), updateProduct)
    .delete(protect, restrictTo('seller'), deleteProduct);


module.exports = router;
