var express = require('express');
var rentalManager = require('../js/rentalManager');
var router = express.Router();

var user = require('../models/user').model;
var admin = require('../models/admin').model;
var house = require('../models/house').model;
var cookie = require('cookie');
var cookieParser = require('cookie-parser');


module.exports = function (passport) {
	//TODO store user somewhere for session
	/* GET home page. */
	router.get('/', function(req, res, next) {
		if (req.user) {
		req.session.userName = req.user.username;
	}
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
		// var un = cookie.parse('usernamecookie');
		res.render('addRental', { user: req.session.userName });
	});
	router.post('/addRental',function(req, res) {
		// var un = cookie.parse('usernamecookie');
		console.log("username" + req.session.userName);
		rentalManager.addRental(req, res, req.session.userName);
		res.render('home', { user: req.session.userName });
	});

	router.get('/editRental', function(req, res) {
		res.render('editRental', { house: req.house });
	});

	router.get('/topRentals', function(req, res) {
		res.render('topRentals', { user: req.user, houses: rentalManager.get });
	});

	router.get('/manageRentals', function(req, res) {
		var h = rentalManager.findHousesForUser(req.session.userName);
		
		res.render('manageRentals', { user: req.session.userName, houses: JSON.stringify(h)});
	});
	
	router.get('/user/:id([a-z0-9]+)', function(req, res){
		var isFriend = req.user._friends.some(function (friend){
			return friend.equals(req.params.id);
		});

		if (req.user && req.user._id == req.params.id){
			res.render('profile', { user: req.params.id });
		} else if (isFriend){
			res.render('profile', { 
				user: req.params.id,
				current_user: req.user
			});
		} else{
			res.render('profile', { });	
		}
  		//res.send('user ' + req.params.id);
	});

	router.get('/home', function(req, res) {
        // res.cookie('usernamecookie', req.user.username, { maxAge: 2592000000 });  // Expires in one mon
        if (req.user) {
        req.session.userName = req.user.username;
    }
		res.render('home', { user: req.user });
	});

	router.get('/logout', function(req, res) {
		req.logout();
		// res.clearCookie('usernamecookie');
		res.redirect('/');
	});

	router.get('/network', function(req, res, next){
		if (req.user){
			User
			.findOne({ _id: req.user._id })
			.populate('_friends')
			.exec(function (err) {
				if (req.user._friends.length > 0){
					req.render('network', {
						user: req.user.userName,
						friends: req.user._friends
					});
				} else{
					res.render('network', {	user: req.user.userName });		
				}
			});
		} else{
			res.render('network', {	user: req.user });
		}
	});

	router.get('/admin', function(req, res){
		user.list(function(err, users){
			res.render('admin',{
				"users" : users
			});
		});
	});

	router.post('/modifyHouse', function(req, res){
		// console.log(req.body);
		admin.deleteHouses(req.body.id, req.body.deleteHouse);
		res.location("admin#houses");
		res.redirect("admin#houses");
	});

	router.post('/modifyUser', function(req, res){
		console.log(req.body.modUser.length);
		if(req.body.modUser.length == 1){
			//when length == 1 req.body.id is passed as a string rather than string array
			//of length 1.
			if(req.body.delUser == 1){
				admin.deleteUser(req.body.id);
			}else{
				console.log(req.body.id);
				admin.changeRating(req.body.id, req.body.rating);
			}
		}
		else{
			admin.deleteUsers(req.body.modUser, req.body.id, req.body.delUser, function(deleted){
				//users have been deleted, do not both modifying 
				for(var i = 0; i < deleted.length; i++){
					req.body.modUser[deleted[i]] = 0;
				}
			});
			admin.changeRatings(req.body.modUser, req.body.id, req.body.rating);
		}
		res.location("admin#users");
		res.redirect("admin#users");

	});

	router.post('/')
	return router;
}

var isAuthenticated = function (req, res, next) {
	// check if user is authenticated
	if (req.isAuthenticated()) {
		return next;
	}

	// if not authenticated, then redirect to login page

	res.redirect('/login');
}