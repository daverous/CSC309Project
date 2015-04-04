var express = require('express');
var router = express.Router();
var cookie = require('cookie');
var cookieParser = require('cookie-parser');


module.exports = function(app, passport) {
    var user = require('./models/user').model;
    var rating = require('./models/user').rmodel;
    var admin = require('./models/admin').model;
    var HouseProfile = require('./models/house').model;
    var rentalManager = require('./js/rentalManager');
    var network = require('./js/network');

    app.use('/public', express.static('./public'));

    //TODO store user somewhere for session
    /* GET home page. */
    app.get('/', function(req, res, next) {
        if (req.user) {
            req.session.userName = req.user.username;
        }
        res.render('index', {
            user: req.user
        });
    });

    app.get('/login', function(req, res, next) {
        res.render('login', {
            message: req.flash('message')
        });
    });

    app.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/register', function(req, res, next) {
        res.render('register', {
            message: req.flash('message')
        });
    });

    app.post('/register', passport.authenticate('register', {
        successRedirect: '/home',
        failureRedirect: '/register',
        failureFlash: true
    }));

    app.get('/addRental', function(req, res) {
        // var un = cookie.parse('usernamecookie');
        isAuthenticated(req, res, function() {
            res.render('addRental', {
                user: req.session.userName
            });
        });
    });
    app.post('/addRental', function(req, res) {
        isAuthenticated(req, res, function() {
            console.log('username' + req.session.userName);
            rentalManager.addRental(req, res, req.session.userName);
            res.redirect('/home');
        });
    });

    // app.get('/editRental', function (req, res) {
    //     res.render('error', {status: ''});
    // });

    app.post('/editRental', function(req, res) {
        isAuthenticated(req, res, function() {
            HouseProfile.findOne({
                _id: req.body.id
            }, function(err, houseObj) {
                if (err) {
                    return console.err(err);
                }
                if (!houseObj) {
                    console.log('house not found');
                }
                console.log('name' + houseObj);
                res.render('editRental', {
                    house: houseObj
                });
            });
        });
    });
    app.get('/editProfile', function(req, res) {
        isAuthenticated(req, res, function() {
            user.findOne({
                username: req.session.userName
            }, function(err, userObj) {
                if (err) {
                    return console.err(err);
                }
                console.log("ds");
                res.render('editUser', {
                    user: userObj
                });
            });
        });
    });

    // TODO this modification needs done! EDIT
    app.post('/modifyUser', function(req, res) {
        isAuthenticated(req, res, function() {
            rentalManager.editUser(req, res, function() {
                res.redirect('home');
            });
        });
    });

    app.post('/modifyRental', function(req, res) {
        isAuthenticated(req, res, function() {
            rentalManager.editRental(req, res, req.session.userName);
        });
    });


    app.get('/user/profile', function(req, res) {
        isAuthenticated(req, res, function() {
            user.findOne({
                username: req.session.userName
            })
                .exec(function(err, user) {
                    if (!user) {
                        res.status(404).send('No user found');
                    } else {
                        console.log('Profile of user sent');
                        res.json(user);
                    }
                });
        });
    });

    app.get('/manageRentals', function(req, res) {
        var h = rentalManager.findHousesForUser(req.session.userName);

        res.render('manageRentals', {
            user: req.session.userName,
            houses: JSON.stringify(h)
        });
    });


    app.get('/user/:id([a-z0-9]+)', function(req, res) {
        console.log(req.params.id);
        isAuthenticated(req, res, function() {
            user.find({
                username: req.session.userName
            }, function(err, cuser) {
                var isFriend = cuser._friends.some(function(friend) {
                    return friend._id == req.params.id;
                });
                user.findOne({
                    _id: req.params.id
                }, function(err, id_user) {
                    var rating = network.calcRating(id_user);

                    if (cuser && cuser._id == req.params.id) {
                        res.render('profile', {
                            user: id_user
                        });
                    } else if (isFriend) {
                        res.render('profile', {
                            user: id_user,
                            current_user: cuser,
                            rating: rating
                        });
                    }

                });


                //res.send('user ' + req.params.id);
            });
        });
    });

    app.post('/user/:id([a-z0-9]+)', function(req, res) {
        isAuthenticated(req, res, function() {
            user.find({
                username: req.session.userName
            }, function(err, cuser) {
                network.addRating(req, res, cuser);
                res.send('Updated rating');
            });
        });
    });

    app.get('/home', function(req, res) {
        function render(user, houses) {
            res.render('home', {
                user: req.user,
                'userName': req.user.username,
                'houses': houses
            });
        }
        var renderUser = function() {
            console.log('in render user');
            if (req.user) {
                req.session.userName = req.user.username;
                HouseProfile.find({
                    owner: req.user.username
                }, function(err, houses) {
                    if (err) {
                        console.log('could not find house');
                    }
                    // console.log(houses);
                    render(req.user, houses);
                });
            } else {
                console.log('there has been an error jeff');
                res.render(error);
            }
        }
        isAuthenticated(req, res, renderUser);

    });


    app.get('/logout', function(req, res) {
        req.logout();
        // res.clearCookie('usernamecookie');
        res.redirect('/');
    });

    app.get('/network', function(req, res, next) {

        isAuthenticated(req, res, function() {
            user.findOne({
                username: req.session.userName
            }, function(err, cuser) {
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
        });
    });

    app.get('/admin', function(req, res) {
        user.list(function(err, users) {
            res.render('admin', {
                'users': users
            });
        });
    });

    app.get('/browse/:id', function(req, res) {
        isAuthenticated(req, res, function() {
            res.render('browse', {
                'userName': req.params.id
            });
        });
    });

    app.post('/rent', function(req, res) {
        isAuthenticated(req, res, function() {
            var dateObj = new Date();
            res.render('rentalAgreement', {
                id: req.body.id,
                user: req.session.userName,
                house: req.body.house,
                owner: req.body.owner,
                date: dateObj
            });
        });
    });
    app.post('/rentaccept', function(req, res) {
        isAuthenticated(req, res, function() {
            rentalManager.addTennant(req, req.session.userName, function() {
                res.redirect('/home');
            });
        });
    });

    app.get('/listHouses', function(req, res) {
        isAuthenticated(req, res, function() {
            HouseProfile.list(function(err, houses) {
                console.log(houses);
                res.render('listHouses', {
                    'houses': houses
                });
            });
        });
    });

    app.post('/modifyHouse', function(req, res) {
        isAuthenticated(req, res, function() {
            admin.deleteHouses(req.body.id, req.body.deleteHouse);
            res.location('admin#houses');
            res.redirect('admin#houses');
        });
    });

    app.post('/modifyUser', function(req, res) {
        isAuthenticated(req, res, function() {
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
            res.location('admin#users');
            res.redirect('admin#users');

        });
    });

    app.get('/get/homes', function(req, res) {
        isAuthenticated(req, res, function() {
            HouseProfile.find().exec(function(err, houses) {
                if (err) {
                    throw err;
                } else {
                    res.status(200).send(houses);
                }
            });
        });
    });

    app.get('/get/edithomes', function(req, res) {
        isAuthenticated(req, res, function() {
            HouseProfile.find({
                owner: req.session.userName
            })
                .exec(function(err, houses) {
                    if (err) {
                        throw err;
                    } else {
                        res.status(200).send(houses);
                    }
                });
        });
    });

    app.get('/get/allusers', function(req, res) {
        isAuthenticated(req, res, function() {
            user.find().exec(function(err, users) {
                if (err) {
                    throw err;
                } else {
                    res.status(200).send(users);
                }
            });
        });
    });

    app.get('/get/authUser', function(req, res) {
        isAuthenticated(req, res, function() {
            user.find({
                username: req.session.userName
            }).exec(function(err, users) {
                if (err) {
                    throw err;
                } else {
                    res.status(200).send(users);
                }
            });
        });
    });
    //Query keyword using max limit
    app.get('/get/homes/:id', function(req, res) {
        isAuthenticated(req, res, function() {
            var input = req.params.id;
            input = input.split('++');
            var keyword = new RegExp(input[0], 'i');
            var num = input[1];
            console.log('Sent query - ' + input[0] + ' num - ' + num);

            HouseProfile.find().or([{
                'name': {
                    $regex: keyword
                }
            }, {
                'desc': {
                    $regex: keyword
                }
            }, {
                'owner': {
                    $regex: keyword
                }
            }, {
                'addr': {
                    $regex: keyword
                }
            }, {
                'phone': {
                    $regex: keyword
                }
            }, {
                'currentRenters.firstName': {
                    $regex: keyword
                }
            }, {
                'currentRenters.lastName': {
                    $regex: keyword
                }
            }, {
                'currentRenters.email': {
                    $regex: keyword
                }
            }, ]).limit(num).exec(
                function(err, homes) {
                    if (!homes) {
                        res.status(404).send('No homes found');
                    } else {
                        res.status(200).send(homes);
                    }
                });
        });
    });

    app.post('/')
    app.get('*', function(req, res) {
        res.render('notfound', 404);
    });
}

var isAuthenticated = function(req, res, next) {
    console.log("home?");
    // check if user is authenticated
    if (req.isAuthenticated()) {
        console.log('isAuthenticated');
        return next();
    }

    // if not authenticated, then redirect to login page

    res.redirect('/login');
}