var express = require('express');
var rentalManager = require('../js/rentalManager');
var router = express.Router();
var User = require('../models/user');

module.exports = function (passport) {
	//TODO store user somewhere for session
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
	router.post('/addRental',function(req, res) {
		rentalManager.addRental(req, res);
		res.render('home', { user: req.user });
	});
	router.get('/editRental', function(req, res) {
		res.render('editRental', { house: req.house });
	});

	router.get('/topRentals', function(req, res) {
		res.render('topRentals', { user: req.user, houses: rentalManager.get });
	});

	router.get('/manageRentals', function(req, res) {
		houses = 
		res.render('manageRentals', { user: req.user, houses: req.houses });
	});
	router.get('/user/:id([0-9]+)', function(req, res){
		res.render('/profile', { user: req.params.id});
  		res.send('user ' + req.params.id);
});
	//TODO Need a function that finds a user from ID above


	router.get('/home', function(req, res) {
		res.render('home', { user: req.user });
	});

	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/network', function(req, res, next){
		if (req.user){
			User
			.findOne({ _id: req.user._id })
			.populate('_friends')
			.exec(function (err, network_list) {
				res.render('network', {
					user: req.user,
					friends: network_list
				});
			});
		} else{
			res.render('network', {	user: req.user });
		}
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