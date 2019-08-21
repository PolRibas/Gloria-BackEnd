const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const userSchema = new Schema({
  username: {
      type: String,
      required: true,
      unique: true
},
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
      type: String,
      default: ''
  },
  surname: {
    type: String,
    default: ''
},
  parentOf: [{
    type: ObjectId,
    ref: 'User'
  }],
  image: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo7k8ejWKeaxHx1BzanG1IvWaYVxY_zc1D2nxvEenUGhxHicHgtQ'
  }  ,
  team: { 
    name: String,
    credential: {
        type: String,
        enum: ['fisicalTrainer', 'trainer', 'player', 'parent']
    },
    club: [{
    type: ObjectId,
    ref: 'Club'
  }]},
  password:{ 
      type: String,
    required: true},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;