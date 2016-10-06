var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;

var routes = require('./routes/index');
var user = require('./routes/user');
var doctor = require('./routes/doctor');
var patient = require('./routes/patient');
var pharmacy = require('./routes/pharmacy');
var tests = require('./routes/tests');

var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 40);

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Parse-Application-Id');

    next();
};
app.use(allowCrossDomain);

// Set Parse Server env
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
var api = new ParseServer({
  databaseURI: databaseUri || config.Parse.databaseURI,
  cloud: process.env.CLOUD_CODE_MAIN || config.Parse.cloud,
  appId: process.env.APP_ID || config.Parse.appId,
  masterKey: process.env.MASTER_KEY || config.Parse.masterKey,
  serverURL: process.env.SERVER_URL || config.Parse.serverURL,
  liveQuery: config.Parse.liveQuery
});
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/patient', patient);
app.use('/doctor', doctor);
app.use('/pharmacy', pharmacy);
app.use('/test', tests);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error();
  err.status = 404;
  res.json({
    'message': 'path ' + req.originalUrl + ' Not Found'
  })
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
