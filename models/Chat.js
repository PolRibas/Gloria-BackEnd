'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatShema = new Schema({
  user: {
    type: String,
    unique: true
  },
  chat: {
    type: Array
  }
});

const Chat = mongoose.model('Chat', chatShema);

module.exports = Application;