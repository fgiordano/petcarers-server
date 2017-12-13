const passport = require('passport');

const User = require('../models/user-model');

//serialize: save only the Id of the user document in the session
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);

});

// deserializa: retrive the full user details from the database using the Id 
//(the user i stored in the session)
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, userDocument);
  })

});