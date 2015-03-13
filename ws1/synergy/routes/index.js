var express = require('express');
var rentalManager = require('../js/rentalManager');
var network = require('../js/network');
var router = express.Router();

var user = require('../models/user').model;
var rating = require('../models/user').rmodel;
var admin = require('../models/admin').model;
var HouseProfile = require('../models/house').model;
var cookie = require('cookie');
var cookieParser = require('cookie-parser');


module.exports = function(passport) {
    //TODO store user somewhere for session
    /* GET home page. */
    router.get('/', function(req, res, next) {
        if (req.user) {
            req.session.userName = req.user.username;
            req.session.user = req.user;
        }
        res.render('index', {
            user: req.user
        });
    });

    router.get('/login', function(req, res, next) {
        res.render('login', {
            message: req.flash('message')
        });
    });

    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.get('/register', function(req, res, next) {
        res.render('register', {
            message: req.flash('message')
        });
    });

    router.post('/register', passport.authenticate('register', {
        successRedirect: '/home',
        failureRedirect: '/register',
        failureFlash: true
    }));

    router.get('/addRental', function(req, res) {
        // var un = cookie.parse('usernamecookie');
        res.render('addRental', {
            user: req.session.userName
        });
    });
    router.post('/addRental', function(req, res) {
        // var un = cookie.parse('usernamecookie');
        // console.log(req.body);
        console.log("username" + req.session.userName);
        rentalManager.addRental(req, res, req.session.userName);
        res.redirect('/home');
    });

    // router.get('/editRental', function (req, res) {
    //     res.render('error', {status: ""});
    // });

    router.post('/editRental', function(req, res) {
        console.log(req.body.id);
        HouseProfile.findOne({
            _id: req.body.id
        }, function(err, houseObj) {
            if (err) {
                return console.err(err);
            }
            if (!houseObj) {
                console.log("house not found");
            }
            console.log("name" + houseObj);
            res.render('editRental', {
                house: houseObj
            });
        })
    });
    router.post('/modifyRental', function(req, res) {
        console.log(req.body.desc);
        rentalManager.editRental(req, res, req.session.userName);
        res.redirect('/home');
        // TODO success screen
    });

    router.get('/manageRentals', function(req, res) {
        var h = rentalManager.findHousesForUser(req.session.userName);

        res.render('manageRentals', {
            user: req.session.userName,
            houses: JSON.stringify(h)
        });
    });

    router.get('/user/:id([a-z0-9]+)', function(req, res) {
        var cuser = req.session.user;
        var isFriend = cuser._friends.some(function(friend){
        	return friend._id == req.params.id;
        });
        user.findOne({_id: req.params.id}, function(err, id_user){
        	var rating = network.calcRating(id_user);

	        if (cuser && cuser._id == req.params.id) {
	            res.render('profile', {
	                user: id_user,
	                current_user: cuser
	            });
	        } else if (isFriend) {
	            res.render('profile', {
	                user: id_user,
	                current_user: cuser,
	                rating: rating
	            });
	        } else {
	            res.render('profile', {});
	        }
        });
        //res.send('user ' + req.params.id);
    });
    router.post('/user/:id([a-z0-9]+)', function(req, res) {
        network.addRating(req, res, req.session.user);
        res.send("Updated rating");
    });

    router.get('/home', function(req, res) {
        // res.cookie('usernamecookie', req.user.username, { maxAge: 2592000000 });  // Expires in one mon
        function render(user, houses) {
            res.render('home', {
                user: req.user,
                "houses": houses
            });
        }

        if (req.user) {
            req.session.userName = req.user.username;
            req.session.user = req.user;
            HouseProfile.find({
                owner: req.user.username
            }, function(err, houses) {
                if (err) {
                    console.log("could not find house");
                }
                // console.log(houses);
                render(req.session.user, houses);
            });
        }

    });

    router.get('/logout', function(req, res) {
        req.logout();
        // res.clearCookie('usernamecookie');
        res.redirect('/');
    });

    router.get('/network', function(req, res, next) {
        var cuser = req.session.user;

        if (cuser) {
            user
                .findOne({
                    _id: cuser._id
                })
                .populate('_friends')
                .exec(function(err) {
                    if (cuser._friends.length > 0) {
                    	console.log(cuser._friends);
                        res.render('network', {
                            user: req.session.userName,
                            friends: cuser._friends
                        });
                    } else {
                        res.render('network', {
                            user: req.session.userName
                        });
                    }
                });
        } else {
            res.render('network', {
                user: cuser
            });
        }
    });

    router.get('/admin', function(req, res) {
        user.list(function(err, users) {
            res.render('admin', {
                "users": users
            });
        });
    });
    router.get('/browse', function(req, res) {
        HouseProfile.list(function(err, housesObj) {
            console.log(housesObj);
            res.render('browse', {
                houses: housesObj
            });
        });
    });

    router.post('/rent', function(req, res) {
        // rentalManager.addTennant(req, res, req.session.userName);
        var dateObj = new Date();
        res.render('rentalAgreement', {
            id: req.body.id,
            user: req.session.userName,
            house: req.body.house,
            owner: req.body.owner,
            date: dateObj
        });
    });
    router.post('/rentaccept', function(req, res) {
        rentalManager.addTennant(req, req.session.userName);
        res.redirect('/home');
    });
    router.get('/listHouses', function(req, res) {
        HouseProfile.list(function(err, houses) {
            console.log(houses);
            res.render('listHouses', {
                "houses": houses
            });
        });
    });

    router.post('/modifyHouse', function(req, res) {
        // console.log(req.body);
        admin.deleteHouses(req.body.id, req.body.deleteHouse);
        res.location("admin#houses");
        res.redirect("admin#houses");
    });

    router.post('/modifyUser', function(req, res) {
        console.log(req.body.modUser.length);
        if (req.body.modUser.length == 1) {
            //when length == 1 req.body.id is passed as a string rather than string array
            //of length 1.
            if (req.body.delUser == 1) {
                admin.deleteUser(req.body.id);
            } else {
                console.log(req.body.id);
                admin.changeRating(req.body.id, req.body.rating);
            }
        } else {
            admin.deleteUsers(req.body.modUser, req.body.id, req.body.delUser, function(deleted) {
                //users have been deleted, do not both modifying 
                for (var i = 0; i < deleted.length; i++) {
                    req.body.modUser[deleted[i]] = 0;
                }
            });
            admin.changeRatings(req.body.modUser, req.body.id, req.body.rating);
        }
        res.location("admin#users");
        res.redirect("admin#users");

    });

    router.post('/')
    router.get('*', function(req, res) {
        res.render('notfound', 404);
    });
    return router;
}

var isAuthenticated = function(req, res, next) {
    // check if user is authenticated
    if (req.isAuthenticated()) {
        return next;
    }

    // if not authenticated, then redirect to login page

    res.redirect('/login');
}