var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Rating = require('../models/rating-model');
const User = require ('../models/user-model');
// const upload = require('../configs/multer');

/* GET Rating listing. */
router.get('/ratings', (req, res, next) => {
  Rating.find((err, ratingList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(ratingList);
  });
});

/* CREATE a new Rating. */
router.post('/ratings', function(req, res) {
  const rating = new Rating({
    content: req.body.content,
    stars: req.body.stars,
    author: req.author._id
  });

  const authorId = req.author._id;

  author.save((err) => {
    if (err) {
      return res.send(err);
    }

  User.findByIdAndUpdate({ _id: authorId }, { $push: { ratings: rating._id }}).exec();

    return res.json({
      message: 'New Rating created!',
      rating: rating
    });
  });
});

/* GET a single Rating */
router.get('/ratings/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Rating.findById(req.params.id, (err, theRating) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(theRating);
    });
});

/* EDIT a Rating. */
router.put('/ratings/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    content: req.body.content,
    stars: req.body.stars
  };
  
  Rating.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Rating updated successfully'
    });
  });
})

/* DELETE a Rating. */
router.delete('/ratings/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Ratings.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'rating has been removed!'
    });
  })
});

module.exports = router;