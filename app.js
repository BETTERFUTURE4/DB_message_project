var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var http = require('http')

// indexRouter process HTTP request of http://127.0.0.1/~ 
var indexRouter = require('./routes/index');

// use router module
var userRouter = require('./routes/user');
var chatlistRouter = require('./routes/chatlist');
var router_friends = require('./routes/friends');
var router_myinfo = require('./routes/myinfo');
var router_location = require('./routes/location');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/chatlist', chatlistRouter);
app.use('/api/friends',router_friends);
app.use('/api/myinfo', router_myinfo);
app.use('/api/location', router_location);

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

// Cors --> cross domian problem solving for socket
const cors = require('cors') // get cors module 

app.use(cors({ // register cors module
  credentials: true, // allow credentials
  origin: function(origin, callback) { // check API caller url
    if(['http://localhost:8080'].indexOf(origin) != -1){ // url is allowed client url
      callback(null, true);
    }
    else{
      callback(new Error('Not allowed by CORS'))
    }
  }
}));

// 메인
app.get('/api/', (req,res) => {
  res.send("Hello world!");
});

http.createServer(app).listen(8080, function(){
  console.log('Server Start!');
});

module.exports = app;
