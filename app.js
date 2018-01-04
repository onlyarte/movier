const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

const index = require('./routes/index');
const channel = require('./routes/channel');
const list = require('./routes/list');
const film = require('./routes/film');
const auth = require('./routes/auth');

const app = express();
mongoose.Promise = global.Promise;

// connect to database
mongoose
  .connect(process.env.mdb_url, { useMongoClient: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

// connect to image storage
cloudinary.config({
  cloud_name: process.env.cld_name,
  api_key: process.env.cld_key,
  api_secret: process.env.cld_secret,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  secret: process.env.ses_secret,
  name: process.env.ses_name,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', index);
app.use('/channel', channel);
app.use('/list', list);
app.use('/film', film);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
