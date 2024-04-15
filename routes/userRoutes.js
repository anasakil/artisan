const express = require('express');
const { listUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const routes = express.Router();

router.route('/')
    .get(protect, restrictTo('admin'), listUsers)
    .post(protect, restrictTo('admin'), createUser);

router.route('/:id')
    .get(protect, restrictTo('admin'), getUserById) 
    .put(protect, restrictTo('admin'), updateUser)
    .delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;

const express = require('express');
const { registerUser, getUserProfile,getUsers, updateUserProfile, deleteUser } = require('../controllers/userController');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/user/create',userController.createUser)
router.get('/user/get/:id',userController.getUser)
router.get('/users',userController.getUsers)
router.put('/user/update/:id',userController.updateUser)
router.delete('/user/delete/:id',userController.deleteUser)

module.exports = router