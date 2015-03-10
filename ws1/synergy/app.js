var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// http://runnable.com/UTlPPF-f2W1TAAET/how-to-use-cookies-in-express-for-node-js
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var passport = require('passport');
var bodyParser = require('body-parser');
var express_session = require('express-session');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var authenticate = require('./js/auth');
var rentalManager = require('./js/rentalManager');
var Cookies = require( "cookies" );

mongoose.connect("mongodb://localhost/test");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
// key for hash computation
app.use(express_session({secret: 'top_secret_key'}));

// store and display messages in templates
app.use(flash());

// initialize and start passport session for authentication
app.use(passport.initialize());
app.use(passport.session());


// adding user-authentication code
authenticate(passport);


var routes = require('./routes/index')(passport);

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
