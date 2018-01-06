const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user-model');
const router = express.Router();

router.get('/api/user', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
});

//-------------------------------------------------------- Edit admin route
router.put('/api/user/edit', (req, res) => {
  if (req.isAuthenticated()) {
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   res.status(400).json({ message: 'Specified id is not valid' });
    //   return;
    // }
    const update = {
      // avatarUrl : req.body.avatarUrl,
      username : req.body.username
      // password : req.body.password
    };

    User.findByIdAndUpdate(req.user.id, update, (err) => {
      if (err) {
        res.json({message: 'Please fill out all fields before saving.'});
        return;
      }

      res.json({message: 'Admin updated successfully'});
    });
  }
  else // otherwise res serve 403 (forbidden)
  res.status(403).json({ message: 'Unauthorized. Please login.' });
});

router.delete('/api/user/delete', (req, res) => {
  if (req.isAuthenticated()) {

    User.findByIdAndRemove(req.user.id, (err) => {
      if (err) {
        res.json({message: 'Something went wrong. Please Try again.'});
        return;
      }

      res.json({message: 'Account Deleted!'});
    });
  }
  else // otherwise res serve 403 (forbidden)
  res.status(403).json({ message: 'You can\'t do that. Please log in first.' });
});

// //-------------------------------------------------------- Delete admin route
// router.delete('/delete/:id', (req, res) => {
//   // Checks if user ID is valid in the URL
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }
//
//   User.remove({ _id: req.params.id }, (err) => {
//     if (err) {
//       res.json(err);
//       return;
//     }
//
//     return res.json({
//       message: 'User has been Deleted'
//     });
//   })
// });

module.exports = router;

//-------------------------------------

// var express  = require('express');
// var router   = express.Router();
// var mongoose = require('mongoose');
// // const bcrypt = require('bcrypt');

// const User = require('../models/user-model');

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// /* EDIT a User. */
// router.put('/user/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }
//   console.log(req.body.signupUsername);
//   const updates = {
//     username: req.body.signupUsername,
//   };
  
//   User.findByIdAndUpdate(req.params.id, updates, (err) => {
//     if (err) {
//       res.json(err);
//       return;
//     }

//     res.json({
//       message: 'User updated successfully'
//     });
//   });
// })

// module.exports = router;
