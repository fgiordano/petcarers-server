var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const multer = require('multer');
const PetModel = require('../models/pet-model');
const User = require ('../models/user-model');
// const upload = require('../configs/multer');

const myUploader = multer({
  dest: __dirname + '/../public/uploads/'
});

router.post(
  '/api/pets',
  myUploader.single('petPicture'),
  (req, res, next) => {
      if (!req.user) {
        res.status(401).json({ message: 'Log in to make pets' });
        return;
      }

      const thePet = new PetModel({
        name: req.body.petName,
        age: req.body.petAge,
        user: req.user._id
      });

      console.log(thePet);

      if (req.file) {
        thePet.picture = '/uploads/' + req.file.filename;
      }
      req.user.pets.push(thePet);
      console.log();

      thePet.save((err) => {
          // Unknown error from the database
          if (err) {
            res.status(500).json({ message: 'Pet save went to 💩' });
            return;
          }

          // Put the full user info here for Angular
  // }
  // else // otherwise res serve 403 (forbidden)
  // res.status(403).json({ message: 'Unauthorized. Please login.' });

     req.user.save((err) => {
      if (err) {
        console.log('Errors saving USER in New Pets Route',err)
        return res.status(500).json({message: 'Something went wrong.',err});
      } else {
        res.status(200).json(thePet);
      }

      // Success!
    });





          //include here the UPDATE to update the user to have the new pet

      }); // close theCamel.save()
}); // close router.post('/api/..., ...


router.get('/api/pets', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Log in to see pets' });
      return;
    }

    PetModel
      .find({user:req.user._id})

      // retrieve all the info of the owners (needs "ref" in model)

      // don't retrieve "encryptedPassword" though

      .exec((err, allPets) => {
          if (err) {
            res.status(500).json({ message: 'Pet find went wrong' });
            return;
          }

          res.status(200).json(allPets);
      });
}); // close router.get('/api/camels', ...

//-------------------get other users pets

router.get('/api/pets/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Log in to see pets' });
      return;
    }

    PetModel
      .find({user:req.params.id})

      // retrieve all the info of the owners (needs "ref" in model)

      // don't retrieve "encryptedPassword" though

      .exec((err, allPets) => {
          if (err) {
            res.status(500).json({ message: 'Pet find went wrong' });
            return;
          }

          res.status(200).json(allPets);
      });
}); // close router.get('/api/camels', ...


module.exports = router;

// ---------------------------------------

// /* GET Pet listing. */
// router.get('/pets', (req, res, next) => {
//   Pet.find((err, petList) => {
//     if (err) {
//       res.json(err);
//       return;
//     }
//     res.json(petList);
//   });
// });

// /* CREATE a new Pet. */
// router.post('/pets', function(req, res) {
// 	console.log('checking the req', req.user)
//   const pet = new Pet({
//     name: req.body.name,
//     age: req.body.age,
//     owner: req.user._id,
//     breed: req.body.breed,
//     weight: req.body.weight,
//     aboutme: req.body.aboutme
//   });

//   const userId = req.user._id;

//   pet.save((err) => {
//     if (err) {
//       return res.send(err);
//     }

//   User.findByIdAndUpdate({ _id: userId }, { $push: { pets: pet._id }}).exec();

//     return res.json({
//       message: 'New Pet added!',
//       pet: pet
//     });
//   });
// });

// /* GET a single Pet */
// router.get('/pets/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }
  
//   Pet.findById(req.params.id, (err, thePet) => {
//       if (err) {
//         res.json(err);
//         return;
//       }

//       res.json(thePet);
//     });
// });

// /* EDIT a Pet. */
// router.put('/pets/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }

//   const updates = {
//     name: req.body.name,
//     age: req.body.age
//   };
  
//   Pet.findByIdAndUpdate(req.params.id, updates, (err) => {
//     if (err) {
//       res.json(err);
//       return;
//     }

//     res.json({
//       message: 'Pet updated successfully'
//     });
//   });
// })

// /* DELETE a Pet. */
// router.delete('/pets/:id', (req, res) => {
//   if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     res.status(400).json({ message: 'Specified id is not valid' });
//     return;
//   }
  
//   Pet.remove({ _id: req.params.id }, (err) => {
//     if (err) {
//       res.json(err);
//       return;
//     }

//     return res.json({
//       message: 'pet has been removed!'
//     });
//   })
// });

// module.exports = router;