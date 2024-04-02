const express = require('express');
const { listUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, restrictTo('admin'), listUsers)
    .post(protect, restrictTo('admin'), createUser);

router.route('/:id')
    .get(protect, restrictTo('admin'), getUserById) 
    .put(protect, restrictTo('admin'), updateUser)
    .delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
