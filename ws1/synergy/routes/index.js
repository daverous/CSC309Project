var express = require('express');
var router = express.Router();
var user = require('../models/user').model;
var admin = require('../models/admin').model;
var house = require('../models/house').model;
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

	router.get('/network', function(req, res, next) {
	  res.render('network', { user: req.user });
	});

	router.get('/listUsers', function(req, res){
		user.list(function(err, users){
			res.render('listUsers',{
				"users" : users
			});
		});
	});

	router.get('/listHouses', function(req, res){
		house.list(function(err, houses){
			res.render('listHouses',{
				"houses" : houses
			});
		});
	});

	router.post('/modifyHouse', function(req, res){
		console.log(req.body);
		admin.deleteHouses(req.body.id, req.body.deleteHouse);
	})
	router.post('/modifyUser', function(req, res){
		console.log(req.body);
		admin.deleteUsers(req.body.modUser, req.body.id, req.body.delete);
		admin.changeRatings(req.body.modUser, req.body.id, req.body.rating);
		res.location("listUsers");
		res.redirect("listUsers");

	});

	router.post('/')
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