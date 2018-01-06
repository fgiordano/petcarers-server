const express    = require('express');
const mongoose   = require('mongoose');
const bcrypt     = require('bcrypt');
const passport   = require('passport');
const User       = require('../models/user-model');

const router = express.Router();

//--------------------------------------------------------Sign up route
router.post('/api/signup', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  //second step of sign up
  if (!username || !password) {
    res.status(400).json({message: 'Provide the email and password.'});
    return;
  }

  // See if the user is already taken (query the database)
  User.findOne({ username: username }, '_id', (err, foundUser) => {
    if (foundUser){
      res.status(400).json({message: 'The username already exists. Try another one.'});
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const theUser = new User({
      username: username,
      password: hashPass,
    });

    theUser.save((err) => {
      if (err){
        res.status(500).json({message: 'Something went wrong creating your account in the database. User account was not created so please try again.'});
        return;
      }

      req.login(theUser, (err) => { // Logins the user after successful account creation
        if (err){
          res.status(500).json({message: 'Something went wrong at the loging in step. Please try again.'});
          return;
        }
        theUser.password = undefined; // hides user's password from response. Only shows in database.
        res.status(200).json(theUser); // SHows back the user acount info in a server 200 res
      });
    }); // closes theUser.save()
  }); // closes User.findOne()
}); // closes GET /signup

//--------------------------------------------------------Login route
router.post('/api/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username}, (err, foundUser) => {   // query accounts by username entered

    if (!username || !password ){ // if no username or password is found execute a server 400 res
      res.status(400).json({message: 'Please make sure all required fields are filled out correctly.'});
      return;
    }

    if (!foundUser) { // checks if username exists
      res.status(400).json({message: 'Email entered does not exist in the database. Please try a different email or sign up for a new account.'});
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) { // checks if user's entered password matches the password encrypted with the foundUser
    res.status(400).json({message: 'Incorrect password.'});
    return;
  }

  // log the user in
  req.login(foundUser, (err) => {
    foundUser.password = undefined; // hides the bcrypt password so it doenst return in the response
    // res.status(200).json({message: 'Log in successful!'});
    res.status(200).json(foundUser);
    console.log('hello bitch');
    return;
  });

}); // User.findOne()
});// POST /login

//--------------------------------------------------------Log out route
router.post('/api/logout', (req, res, next) => {
  req.logout(); // this is the function that logsout the user
  res.status(200).json({ message: 'Log out was successful!' });
});

//--------------------------------------------------------Validate user is loged in route
router.get('/api/checklogin', (req, res, next) => { // this function verifies if the user is authenticated or not.
  if (req.isAuthenticated()) { // passing the isAuthenticated function which will verify for us the user is authenticated.
    res.status(200).json(req.user);
    return;
  }// Checking if loged in or not

  else // otherwise res serve 403 (forbidden)
    res.status(403).json({ message: 'Unauthorized. Please login.' });
});



module.exports = router;

// --------------------------------------
// const express = require('express');
// const bcrypt = require('bcrypt');
// const passport = require('passport');


// const UserModel = require('../models/user-model');


// const router = express.Router();


// router.post('/api/signup', (req, res, next) => {
//     if (!req.body.signupUsername || !req.body.signupPassword) {
//         // 400 for client errors (user needs to fix something)
//         res.status(400).json({ message: 'Need both email and password 💩' });
//         return;
//     }

//     UserModel.findOne(
//       { email: req.body.signupUsername },
//       (err, userFromDb) => {
//           if (err) {
//             // 500 for server errors (nothing user can do)
//             res.status(500).json({ message: 'Email check went to 💩' });
//             return;
//           }

//           if (userFromDb) {
//             // 400 for client errors (user needs to fix something)
//             res.status(400).json({ message: 'Email already exists 💩' });
//             return;
//           }

//           const salt = bcrypt.genSaltSync(10);
//           const thePassword = bcrypt.hashSync(req.body.signupPassword, salt);

//           const theUser = new UserModel({
//             username: req.body.signupUsername,
//             password: thePassword
//           });

//           theUser.save((err) => {
//               if (err) {
//                 res.status(500).json({ message: req.body.signupUsername});
//                 return;
//               }

//               // Automatically logs them in after the sign up
//               // (req.login() is defined by passport)
//               req.login(theUser, (err) => {
//                   if (err) {
//                     res.status(500).json({ message: 'Login went to 💩' });
//                     return;
//                   }

//                   // Clear the encryptedPassword before sending
//                   // (not from the database, just from the object)
//                   theUser.password = undefined;

//                   // Send the user's information to the frontend
//                   res.status(200).json(theUser);
//               }); // close req.login()
//           }); // close theUser.save()
//       }
//     ); // close UserModel.findOne()
// }); // close router.post('/signup', ...


// // This is different because passport.authenticate() redirects
// // (APIs normally shouldn't redirect)
// router.post('/api/login', (req, res, next) => {

    

//     // const username = req.body.signupUsername;
//     // const email = req.body.signupEmail;
//     // const encryptedPassword = req.body.signupPassword;

//     // const theUser = new UserModel({
//     //         username: req.body.signupUsername,
//     //         email: req.body.signupEmail,
//     //         encryptedPassword: scrambledPassword
//     //       });

// 	console.log("testingggg", req.body);
//     const authenticateFunction =
//       passport.authenticate('local', (err, theUser, extraInfo) => {
//           // Errors prevented us from deciding if login was a success or failure
//           if (err) {
//             res.status(500).json({ message: 'Unknown login error 💩' });
//             return;
//           }

//           // Login failed for sure if "theUser" is empty
//           if (!theUser) {
//             // "extraInfo" contains feedback messages from LocalStrategy
//             res.status(401).json(extraInfo);
//             return;
//           }

//           // Login successful, save them in the session.
//           req.login(theUser, (err) => {
//               if (err) {
//                 res.status(500).json({ message: 'Session save error 💩' });
//                 return;
//               }

//               // Clear the encryptedPassword before sending
//               // (not from the database, just from the object)
//               theUser.encryptedPassword = undefined;

//               // Everything worked! Send the user's information to the client.
//               res.status(200).json(theUser);
//           });
//       });

//     authenticateFunction(req, res, next);
// });


// router.post('/api/logout', (req, res, next) => {
//     // req.logout() is defined by passport
//     req.logout();
//     res.status(200).json({ message: 'Log out success! 🐫' });
// });


// router.get('/api/checklogin', (req, res, next) => {
//     if (!req.user) {
//       res.status(401).json({ message: 'Nobody logged in. 🥒' });
//       return;
//     }

//     // Clear the encryptedPassword before sending
//     // (not from the database, just from the object)
//     req.user.encryptedPassword = undefined;

//     res.status(200).json(req.user);
// });


// module.exports = router;

// ------------------------------------------------------------------------

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