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

router.get('/me', isLoggedIn(), async (req, res, next) => {
    
  
  res.json(userToSend);
});


module.exports = router;