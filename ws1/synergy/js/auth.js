var bCrypt = require('bcrypt-nodejs');
var PassportLocalStrategy = require('passport-local').Strategy;
var UserProfile = require('../models/user').model;

module.exports = function (passport) {

    // verify password
    var verifyPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }

    // encrypt password
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    // serialize a user
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });


    // FOR SIGNOUT res.clearCookie('username');

    // deserialize a user
    passport.deserializeUser(function (id, done) {
        UserProfile.findById(id, function (err, user) {
            console.log('deserializing user: ', user);
            done(err, user);
        });
    });

    passport.use('login', new PassportLocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            UserProfile.findOne({
                    'username': username
                },
                function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    // check if user already exists
                    if (!user) {
                        console.log('Error: Username does not exist ' + username);
                        return done(null, false, req.flash('message', 'Error: Username not found'));
                    }

                    // verify is the password is valid
                    if (!verifyPassword(user, password)) {
                        console.log('Error: Invalid password');
                        return done(null, false, req.flash('message', 'Error: Invalid password'));
                    }
                    return done(null, user);
                }
            );

        }));

    passport.use('register', new PassportLocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {

            findOrCreateUser = function () {
                // search in database using username
                UserProfile.findOne({
                    'username': username
                }, function (err, user) {
                    if (err) {
                        console.log('Error (in login): ' + err);
                        return done(err);
                    }

                    if (!user) {
                        // create a new user profile
                        if (password != req.param('confirmPassword')) {
                            console.log('Error (passwords do not match): ' + username);
                            return done(null, false, req.flash('message', 'Error: Passwords do not match'));
                        }

                        var createUser = new UserProfile();
                        createUser.username = username;
                        createUser.email = req.param('email');
                        createUser.firstName = req.param('fName');
                        createUser.lastName = req.param('lName');
                        createUser.password = createHash(password);

                        // add the user to the database
                        createUser.save(function (err) {
                            if (err) {
                                console.log('Error (could not save): ' + err);
                                throw err;
                            }
                            console.log('Added user succesfully');
                            return done(null, createUser);
                        });
                    } else {
                        // if username exists in database
                        console.log('Error (user exists): ' + username);
                        return done(null, false, req.flash('message', 'Error: Username has been taken'));
                    }
                });
            };

            process.nextTick(findOrCreateUser);
        }));
}