var express = require('express');
var router = express.Router();

module.exports = function (passport) {

	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { user: req.user });
	});

	router.get('/login', function(req, res, next) {
	  res.render('login', { message: req.flash('message') });
	});

	router.post('/login', passport.authenticate('login', {
			successRedirect: '/home',
			failureRedirect: '/login',
			failureFlash : true  
	}));

	router.get('/register', function(req, res, next) {
	  res.render('register', { message: req.flash('message') });
	});

	router.post('/register', passport.authenticate('register', {
		successRedirect: '/home',
		failureRedirect: '/register',
		failureFlash : true  
	}));

	router.get('/addRental', function(req, res) {
		res.render('addRental', { user: req.user });
	});

	router.get('/editRental', function(req, res) {
		res.render('editRental', { user: req.user });
	});

	router.get('/topRentals', function(req, res) {
		res.render('topRentals', { user: req.user });
	});

	router.get('/home', function(req, res) {
		res.render('home', { user: req.user });
	});

	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}

var isAuthenticated = function (req, res, next) {
	// check if user is authenticated
	if (req.isAuthenticated()) {
		return next();
	}

	// if not authenticated, then redirect to login page
	res.redirect('/login');
}