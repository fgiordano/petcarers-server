var express = require('express');
var router = express.Router();
var mongoose     = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user-model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* EDIT a User. */
router.put('/user/:id', (req, res) => {
  console.log('hey url!')
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    username: req.body.signupUsername,
  };
  
  User.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'User updated successfully'
    });
  });
})

module.exports = router;
