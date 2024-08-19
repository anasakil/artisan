const User = require('../models/User'); 

const createUser = async (req, res) => {
  try {
    if (req.body.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create users' });
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const  listUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = {
    listUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
  };
  