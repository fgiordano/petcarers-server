const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const reviewSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Please tell us about your review.'],
    minlength: [50, 'Please write at least 50 characters.'],
    maxlength: [400, 'Type less please.']
  },
  stars: {
    type: Number,
    required: [true, 'Rate the product.'],
    min: [1, 'Ratings can be no lower than 1 star.'],
    max: [5, 'Ratings can be no better than 5 stars.']
  },
  author: {
    type: String,
    required: [true, 'Please provide your name']
  },
  // BY REFERENCE INSTEAD OF SUBDOCUMENTS
  // product: { type: Schema.Types.ObjectId }
});

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;