var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Pet = require('../models/pet-model');
// const upload = require('../configs/multer');

/* GET Pet listing. */
router.get('/pets', (req, res, next) => {
  Pet.find((err, petList) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(petList);
  });
});

/* CREATE a new Pet. */
router.post('/pets', function(req, res) {
  const pet = new Pet({
    name: req.body.name,
    age: req.body.age,
  });

  pet.save((err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'New Pet added!',
      pet: pet
    });
  });
});

module.exports = router;