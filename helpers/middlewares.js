'use strict';

const createError = require('http-errors');

exports.isLoggedIn = () => (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    next(createError(401));
  }
};

exports.isNotLoggedIn = () => (req, res, next) => {
  if (!req.session.currentUser) {
    next();
  } else {
    next(createError(403));
  }
};

exports.validationLoggin = () => (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next(createError(422));
  } else {
    next();
  }
};

exports.validationSignup = () => (req, res, next) => {
    console.log(req.body)
    const { email, username, password } = req.body;
  
    if (!username || !password || !email) {
      next(createError(422));
    } else {
      next();
    }
  };
  

