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
      message: Pet has been removed!'
    });
  })
});

module.exports = router;