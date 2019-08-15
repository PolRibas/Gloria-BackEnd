    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId
    
    
    const eventSchema = new Schema({
      team: { 
        name: String,
        club: [{
        type: ObjectId,
        ref: 'Club'
      }]},
      type: {
        type: String,
        enum: ['match', 'training', 'fisical training', 'event', 'reunion'],
        require: true
      },
      attendees: [{
        type: ObjectId,
        ref: 'User'
      }],
      date: {
          type: Date,
      },
      physicalDrain: Number,
      personalData: [{
          user: {
            type: ObjectId,
            ref: 'User' 
          },
          data: [{
              name: String,
              param: String,
              number: Number
          }]
      }],
      personalData: { 
        data: [{
            name: String,
            param: String,
            number: Number
        }]}
    }, {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      },
    });
    
    const Event = mongoose.model('Event', eventSchema);
    
    module.exports = Event;