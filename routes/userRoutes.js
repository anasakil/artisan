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