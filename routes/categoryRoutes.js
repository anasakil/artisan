const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Routes below this line will use the protect and restrictTo middleware, making them accessible only to admins
router.use(protect, restrictTo('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
