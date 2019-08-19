'use strict';

const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Club = require('../models/Club');

const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin,
    validationSignup
  } = require('../helpers/middlewares');

router.put(
    '/updateProfile',
    async (req, res, next) => {
        const current = req.session.currentUser;
    
      const { _id, username, email, firstName, surname } = req.body;
      try {
          const newUser = await User.findByIdAndUpdate(_id, {username, email, firstName, surname}, {new: true})
          req.session.currentUser = newUser
          return res.status(200).json(newUser);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get('/getUserFromUsername/:username', async (req,res,next) => {
    try {
        const {username} = req.params;
        const user = await User.find({username})
        if (!user) {
          return next(createError(466));
        } else { 
          res.status(200).json(user);
        }
      } catch (error) {
        next(error);
      }
  })

  router.get('/getAllUsers', async (req, res, next) => {
    try {
        const users = await User.find()
          res.status(200).json(users);
      } catch (error) {
        next(error);
      }
  })
  
  module.exports = router;