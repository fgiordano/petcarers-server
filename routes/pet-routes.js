var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const Pet = require('../models/pet-model');
const User = require ('../models/user-model');
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
	console.log('checking the req', req.user)
  const pet = new Pet({
    name: req.body.name,
    age: req.body.age,
    owner: req.user._id,
    breed: req.body.breed,
    weight: req.body.weight,
    aboutme: req.body.aboutme
  });

  const userId = req.user._id;

  pet.save((err) => {
    if (err) {
      return res.send(err);
    }

  User.findByIdAndUpdate({ _id: userId }, { $push: { pets: pet._id }}).exec();

    return res.json({
      message: 'New Pet added!',
      pet: pet
    });
  });
});

/* GET a single Pet */
router.get('/pets/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Pet.findById(req.params.id, (err, thePet) => {
      if (err) {
        res.json(err);
        return;
      }

      res.json(thePet);
    });
});

/* EDIT a Pet. */
router.put('/pets/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    name: req.body.name,
    age: req.body.age
  };
  
  Pet.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Pet updated successfully'
    });
  });
})

/* DELETE a Pet. */
router.delete('/pets/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  
  Pet.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    return res.json({
      message: 'pet has been removed!'
    });
  })
});

module.exports = router;