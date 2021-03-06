var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const ReviewModel = require('../models/rating-model');
const User = require ('../models/user-model');

router.post('/api/reviews/', (req, res, next) => {
      if (!req.user) {
        res.status(401).json({ message: 'Log in to leave a review' });
        return;
      }

      console.log("BODY STUFF = ", req.body);

      const superReview = new ReviewModel({
        content: req.body.content,
        author: req.user._id,
        aboutCarer: req.body.aboutCarer
      });
      console.log("BODY STUFF = ", superReview);


      User.findById(req.body.aboutCarer, (err, user) => {
        if (err) {
          res.json(err);
          return;
        }
        console.log("USER = ", user);

        console.log("BODY STUFF = ", superReview);        
        superReview.save((err, review) => {
          // Unknown error from the database
          if (err) {
            res.status(500).json({ message: 'Review save went wrong' + err });
            return;
          }
          user.receivedRatings.push(review._id);

        user.save((err) => {
          if (err) {
            console.log('Errors saving USER in New Rating Route',err)
            return res.status(500).json({message: 'Something went wrong.',err});
          } else {
            res.status(200).json(superReview);
          }
        });

      }); // close the review save
    }); // close user find by id
}); // close router.post('/api/..., ...


router.get('/api/reviews/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Log in to see a review' });
      return;
    }

    User.findById(req.params.id, (err, user) => {
        if (err) {
          res.json(err);
          return;
        }

      ReviewModel
        .find({aboutCarer: user})

        .exec((err, allReviews) => {
            if (err) {
            res.status(500).json({ message: 'Review find went wrong' });
            return;
          }

          res.status(200).json(allReviews);
      });

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