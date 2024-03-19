const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate } = require('../middleware/authenticate'); 
const router = express.Router();

router.post('/', authenticate, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
