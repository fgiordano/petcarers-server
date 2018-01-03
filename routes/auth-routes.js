const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');


const UserModel = require('../models/user-model');


const router = express.Router();


router.post('/api/signup', (req, res, next) => {
    if (!req.body.signupEmail || !req.body.signupPassword) {
        // 400 for client errors (user needs to fix something)
        res.status(400).json({ message: 'Need both email and password 💩' });
        return;
    }

    UserModel.findOne(
      { email: req.body.signupEmail },
      (err, userFromDb) => {
          if (err) {
            // 500 for server errors (nothing user can do)
            res.status(500).json({ message: 'Email check went to 💩' });
            return;
          }

          if (userFromDb) {
            // 400 for client errors (user needs to fix something)
            res.status(400).json({ message: 'Email already exists 💩' });
            return;
          }

          const salt = bcrypt.genSaltSync(10);
          const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

          const theUser = new UserModel({
            username: req.body.signupUsername,
            email: req.body.signupEmail,
            encryptedPassword: scrambledPassword
          });

          theUser.save((err) => {
              if (err) {
                res.status(500).json({ message: req.body.signupUsername});
                return;
              }

              // Automatically logs them in after the sign up
              // (req.login() is defined by passport)
              req.login(theUser, (err) => {
                  if (err) {
                    res.status(500).json({ message: 'Login went to 💩' });
                    return;
                  }

                  // Clear the encryptedPassword before sending
                  // (not from the database, just from the object)
                  theUser.encryptedPassword = undefined;

                  // Send the user's information to the frontend
                  res.status(200).json(theUser);
              }); // close req.login()
          }); // close theUser.save()
      }
    ); // close UserModel.findOne()
}); // close router.post('/signup', ...


// This is different because passport.authenticate() redirects
// (APIs normally shouldn't redirect)
router.post('/api/login', (req, res, next) => {
    const authenticateFunction =
      passport.authenticate('local', (err, theUser, extraInfo) => {
          // Errors prevented us from deciding if login was a success or failure
          if (err) {
            res.status(500).json({ message: 'Unknown login error 💩' });
            return;
          }

          // Login failed for sure if "theUser" is empty
          if (!theUser) {
            // "extraInfo" contains feedback messages from LocalStrategy
            res.status(401).json(extraInfo);
            return;
          }

          // Login successful, save them in the session.
          req.login(theUser, (err) => {
              if (err) {
                res.status(500).json({ message: 'Session save error 💩' });
                return;
              }

              // Clear the encryptedPassword before sending
              // (not from the database, just from the object)
              theUser.encryptedPassword = undefined;

              // Everything worked! Send the user's information to the client.
              res.status(200).json(theUser);
          });
      });

    authenticateFunction(req, res, next);
});


router.post('/api/logout', (req, res, next) => {
    // req.logout() is defined by passport
    req.logout();
    res.status(200).json({ message: 'Log out success! 🐫' });
});


router.get('/api/checklogin', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Nobody logged in. 🥒' });
      return;
    }

    // Clear the encryptedPassword before sending
    // (not from the database, just from the object)
    req.user.encryptedPassword = undefined;

    res.status(200).json(req.user);
});


module.exports = router;

// const express = require('express');
// const bcrypt = require('bcrypt');

// const User = require('../models/user-model');

// const router = express.Router();

// router.post('/signup', (req, res, next) => {
// 	const username = req.body.username;
// 	const password = req.body.password;

// 	if (!username || !password) {
// 		res.status(400).json({ message: 'Provide username and password' });
// 		return;
// 	}

// 	// see if the username is already taken (query the database)
// 	User.findOne({ username: username }, '_id', (err, foundUser) => {
// 		// the username is taken if we found a user
// 		if (foundUser) {
// 			res.status(400).json({ message: 'The username already exists' });
// 			return;
// 		}

// 		// save the user to the database if we didn't find a user
// 		const salt     = bcrypt.genSaltSync(10);
// 		const hashPass = bcrypt.hashSync(password, salt);

// 		const theUser = new User({
// 			username: username,
// 			password: hashPass
// 		});

// 		theUser.save((err) => {
// 			if (err) {
// 				res.status(500).json({ message: 'Something went wrong' });
// 				return;
// 			}

// 			req.login( theUser, (err) => {
// 				// hide the passqord from the frontend by setting it to undefined
// 				theUser.password = undefined;
// 				res.status(200).json(theUser);	
// 			});
// 		}); // theUser.save()
// 	}); // User.findOne()
// }); // POST / signup

// router.post('/login', (req, res, next) => {
// 	const username = req.body.username;
// 	const password = req.body.password;

// 	//see if the username credential is valid
// 	User.findOne({ username: username }, (err, foundUser) => {
// 		//send an error if no useer with that username
// 		if (!foundUser) {
// 			res.status(400).json({ message: 'Incorrect username' });
// 			return;
// 		}

// 		// send an error if password is wrong
// 		if (!bcrypt.compareSync(password, foundUser.password)) {
// 			res.status(400).json({ message: 'Incorrect password' });
// 			return;
// 		}
// 		//if we get here we are GOOD!
// 		// log the user in 
// 		req.login(foundUser, (err) => {
// 			// hide the password from the frontend by setting it to undefined
// 			foundUser.password = undefined;
// 			res.status(200).json(foundUser);
// 		});
// 	}); //User.findOne()
// });//POST / login

// router.post('/logout', (req, res, next) => {
// 	req.logout();
// 	res.status(200).json({ message: 'Success'});
// 	});

// router.get('/loggedin', (req, res, next) => {
// 	if (req.isAuthenticated()) {
// 		res.status(200).json(req.user);
// 		return;
// 	}

// 	res.status(403).json({ message: 'Unauthorized' });
// });

// router.get('/private', (req, res, next) => {
// 	if (req.isAuthenticated()) {
// 		res.json({ message: 'This is a private message' });
// 		return;
// 	}

// 	res.status(403).json({ message: 'Unauthorized' });
// });


// module.exports = router;