var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
var dishRouter = require('./routes/dishRouter.js');
var promoRouter = require('./routes/promoRouter.js');
var leaderRouter = require('./routes/leaderRouter.js');

const Dishes = require('./models/dishes.js');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then( (db) => {
  console.log('connected correctly to the server!\n');
}, (err) => { console.log(err) } );

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret-key'));//secret key used to sign cookies

function auth(req, res, next){
  console.log(req.signedCookies);

  if(!req.signedCookies.user){//if the client doesn't provide any cookie
    var authHeader = req.headers.authorization;
    //if the client is not authenticated
    if(!authHeader){
      var err = new Error('You are not authenticated!');

      res.setHeader('www-authenticate','Basic');
      err.status = 401;
      return next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    
    if(username === 'admin' && password === 'password'){
      //if the client provides the right credentials, we send a cookie
      res.cookie('user','admin', { signed: true });
      next();
    }
    else {
      var err = new Error('You are not authenticated!');

      res.setHeader('www-authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  }
  else {
    if(req.signedCookies.user === 'admin') { //if the client provides the cookie
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }


}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
