const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const eventSchema = new Schema({
  name: {
      type: String,
      required: true,
      unique: true
},
  city: String,
  sport: String,
  image: String,
  administrators: [{
    type: ObjectId,
    ref: 'User'
  }],
  teams: [{
        type: ObjectId,
        ref: 'Team'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Club = mongoose.model('Club', eventSchema);

module.exports = Club;