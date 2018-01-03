const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const cors         = require('cors');

require('./config/database-setup');

require('dotenv').config();

require('./config/passport-setup');


// mongoose.connect(process.env.MONGODB_URI);


const app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'angular and express and auth and shhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  credentials: true,                   // allow other domains to send cookies
  origin: [ 'http://localhost:4200' ]  // these are the domains that are allowed
}));


// ROUTES ----------------------------------------------------------------------
const myAuthRoutes = require('./routes/auth-routes');
app.use('/', myAuthRoutes);

// const myCamelRoutes = require('./routes/camel-routes');
// app.use('/', myCamelRoutes);
// -----------------------------------------------------------------------------


app.use((req, res, next) => {
    // If no routes match, send them the Angular HTML.
    res.sendFile(__dirname + '/public/index.html');
});


module.exports = app;

// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// const passport = require('passport');
// const session = require('express-session');
// var mongoose = require('mongoose');
// var cors = require('cors');


// var index = require('./routes/index');
// var users = require('./routes/users');
// const authRoutes = require('./routes/auth-routes');
// var pets = require('./routes/pet-routes');
// var ratings = require('./routes/rating-routes');
// require('./config/database-setup');
// require('./config/passport-setup');

// var app = express();
// app.use(cors());

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
// 	session({
// 		secret: 'string is to avoid a warning',
// 		resave: true,
// 		saveUninitialized: true
// 	})
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/', index);
// app.use('/users', users);
// app.use('/', authRoutes);
// app.use('/', pets);
// app.use('/', ratings);

// app.use((req, res, next) => {
//   res.sendfile(__dirname + '/public/index.html');
// });


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
