const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const eventSchema = new Schema({
  name: {
      type: String,
      required: true,
      unique: true
},
  administrators: [{
    type: ObjectId,
    ref: 'User'
  }],
  teams: [{
      name: String,
      treiners: [{
        type: ObjectId,
        ref: 'User'
      }],
      emails: Array
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Club = mongoose.model('Club', eventSchema);

module.exports = Club;