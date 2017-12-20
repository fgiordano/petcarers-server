const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User     = require('./user-model');

const ratingSchema = new Schema({
  author     : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content    : { type: String, required: true },
  aboutCarer : { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  stars      : {
    type: Number,
    required: [true, 'Rate your petcarer'],
    min: [1, 'Ratings can be no lower than 1 star.'],
    max: [5, 'Ratings can be no better than 5 stars.']
  }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating; 
