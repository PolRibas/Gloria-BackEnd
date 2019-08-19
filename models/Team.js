const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


const eventSchema = new Schema({
    name: {type: String},
    treiners: [{
        type: ObjectId,
        ref: 'User'
    }],
    events: [{
        type: ObjectId,
        ref: 'Event'
    }],
    players:[{
        type: ObjectId,
        ref: 'User'
    }],
    emails: Array,
 }, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Team = mongoose.model('Team', eventSchema);

module.exports = Team;