var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const ReviewModel = require('../models/rating-model');
const User = require ('../models/user-model');
// const upload = require('../configs/multer');

router.post('/api/reviews/:id', (req, res, next) => {
      if (!req.user) {
        res.status(401).json({ message: 'Log in to leave a review' });
        return;
      }

      const theReview = new ReviewModel({
        content: req.body.reviewContent,
        author: req.user._id,
        aboutCarer: req.params.id
      });

      User.findById(req.params.id, (err, user) => {
        if (err) {
          res.json(err);
          return;
        }

        theReview.save((err, review) => {
          // Unknown error from the database
          if (err) {
            res.status(500).json({ message: 'Review save went wrong' });
            return;
          }
          user.receivedRatings.push(review._id);
        }); 

        user.save((err) => {
          if (err) {
            console.log('Errors saving USER in New Rating Route',err)
            return res.status(500).json({message: 'Something went wrong.',err});
          } else {
            res.status(200).json(theReview);
          }

        });

      }); //
       
}); // close router.post('/api/..., ...


router.get('/api/reviews', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Log in to leave a review' });
      return;
    }

    ReviewModel
      .find({user:req.body.user._id})

      // retrieve all the info of the owners (needs "ref" in model)

      // don't retrieve "encryptedPassword" though

      .exec((err, allReviews) => {
          if (err) {
            res.status(500).json({ message: 'Review find went wrong' });
            return;
          }

          res.status(200).json(allReviews);
      });
}); // close router.get('/api/camels', ...


module.exports = router;


//--------------------------------------
/* GET Rating listing. */
// router.get('/ratings', (req, res, next) => {
//   Rating.find((err, ratingList) => {
//     if (err) {
//       res.json(err);
//       return;
//     }
//     res.json(ratingList);
//   });
// });

// /* CREATE a new Rating. */
// router.post('/ratings', function(req, res) {
//   const rating = new Rating({
//     content: req.body.content,
//     stars: req.body.stars,
//     author: req.user._id,
//     aboutCarer: req.body.aboutCarer
//   });

//   // const userId = req.user._id;
//   const userId = req.body.aboutCarer;

//   rating.save((err) => {
//     if (err) {
//       return res.send(err);
//     }

//   User.findByIdAndUpdate({ _id: userId }, { $push: { receivedRatings: rating._id }}).exec();

//     return res.json({
//       message: 'New Rating created!',
//       rating: rating
//     });
//   });
// });

// /* GET a single Rating */
// router.get('/ratings/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }
  
//   Rating.findById(req.params.id, (err, theRating) => {
//       if (err) {
//         res.json(err);
//         return;
//       }

//       res.json(theRating);
//     });
// });

// /* EDIT a Rating. */
// router.put('/ratings/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }

//   const updates = {
//     content: req.body.content,
//     stars: req.body.stars
//   };
  
//   Rating.findByIdAndUpdate(req.params.id, updates, (err) => {
//     if (err) {
//       res.json(err);
//       return;
//     }

//     res.json({
//       message: 'Rating updated successfully'
//     });
//   });
// })

// /* DELETE a Rating. */
// router.delete('/ratings/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }
  
//   Rating.remove({ _id: req.params.id }, (err) => {
//     if (err) {
//       res.json(err);
//       return;
//     }

//     return res.json({
//       message: 'rating has been removed!'
//     });
//   })
// });

// module.exports = router;