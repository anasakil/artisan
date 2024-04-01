const UserDb = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const path = require('path');

exports.createUser = async (req, res) =>{
    const { name, email, age, password, isAdmin } = req.body
    try {
        const newUser = new UserDb({ name, email, age, password, isAdmin })
        const CreatedUser = await newUser.save()
        res.send(`User successfuly created`)
    } catch (error) {
        res.send('an error has occured', error)
    }

};

exports.getUser = async (req,res) => {
    try {
       const user = await UserDb.findById(req.params.id)
           if(!user) {
            return res.status(404).json({ error: 'User Not Found' })
        }
        res.send(user)
       } catch (error) {
        res.status(500).json({ error: 'Error while getting a User' })
    }
};

exports.getUsers = async (req,res) =>{
    try {
        const Users = await UserDb.find()
        res.status(200).json({ Users })   
    
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting the users' })
    }
};

exports.updateUser = async (req,res) => {
    const  userId = req.body
      try {
       const   UserId = await UserDb.findOneAndUpdate(userId)
          if(!UserId)
          return res.status(404).json({error: 'There is no User with this id or name'})
      res.send(UserId)
      } catch (error) {
          res.status(500).json({ error: 'An error occurred while updating the user' })
      }
};

exports.deleteUser = async (req,res) => {
    try {
        const removedUser = await UserDb.findByIdAndDelete(req.params.id);
        if (!removedUser)
        {return res.status(404).json({error: 'No user found'})}
    res.status(200).json('User has been deleted')
    } catch (error) {
        res.status(500).json({error: 'an error while'})
    }
};