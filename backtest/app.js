var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('./winston');
var morgan = require ('morgan');
var combined = ':remote-addr - :remote-user ".method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

var morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined;
console.log(morganFormat);


var indexRouter = require('./routes/route_my_info');
var usersRouter = require('./routes/route_place');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.use(morgan(morganFormat, {stream : logger.stream}));

app.get('/', (req, res, next) => {
  logger.info('GET /');
  res.status(200).send({
    message : "info test!"
  })
});

app.get('/warn', (req, res, next) => {
  logger.warn('warning');
  res.status(400).send({
    message : "warning test!"
  })
});

app.get('/error', (req, res, next) => {
  logger.error('Error message');
  res.status(500).send({
    message : "error test!"
  })
});

app.listen(port, () => logger.info(`Server Start Listening on port ${port}`));

module.exports = app;
