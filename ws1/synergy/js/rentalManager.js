var HouseProfile = require('../models/house').model;
var util = require('util');
var fs = require('fs');
var bCrypt = require('bcrypt-nodejs');
var network = require('./network');
var PassportLocalStrategy = require('passport-local').Strategy;
var UserProfile = require('../models/user').model;


// var authenticate = require('auth');

module.exports = {
    findHouseById: function(id) {
        console.log("id" + id);
        HouseProfile.find({
            _id: id
        }, function(err, house) {
            if (err) {
                return console.err(err);
            }
            return house;
        });
    },

    // returns houses owned by a given user
    findHousesForUser: function(username) {
        HouseProfile.find({
            owner: username
        }, function(err, houses) {

            if (err) {
                return console.error(err);
            }
            console.log("name" + username);
            console.log(houses);
            return houses;
        });

    },

    // Returns top 10 rentals
    getTopRentals: function(req, done) {

        HouseProfile.find().sort({
            rating: 1
        }).limit(10),
        function(err, houses) {
            if (err) return console.error(err);
            return houses;
        }

    },

    addTennant: function(req, user) {
        console.log(user);
        var id = req.body.id;
        HouseProfile.findOne({
            '_id': id
        }, function(err, house) {
            if (err) {
                throw err;
            }
            if (!house) {
                throw err;
                if (!user) {
                    throw err;
                }
            } else {
                var objects = network.findUsers(house);
                UserProfile.findOne({username : user}, function(err, User){
                    if(User){
                        User._friends.concat(objects);
                        User.save();

                        UserProfile.findOne({username : house.owner}, function(err, owner) {
                            if(owner){
                                owner._friends.push(User);
                                User._friends.push(owner);
                                owner.save();
                                User.save();
                            }
                        });
                    }

                    for (var i = 0; i < house.currentRenters.length; i++) {
                        console.log(house.currentRenters.length);
                        UserProfile.findOne({
                                username : house.currentRenters[i]
                            },
                            function(err, result) {
                                if(result){
                                    result._friends.push(User);
                                    result.save();
                                }
                            });
                    }

                     house.currentRenters.push(user);
                     house.save();
                });

            }

        })
    },
    //add rental to db
    addRental: function(req, done, user) {
        findOrCreateHouse = function() {

            console.log("user" + user);
            console.log(req.body.houseName);
            var houseName = req.body.houseName;
            if (!houseName) {
                console.log('Error. House name undefined');
                return done;
            }
            // if a file has been added (NOT IMPLEMENTED)
            if (req.files) {
                console.log('file info: ', req.files.image);

                //split the url into an array and then get the last chunk and render it out in the send req.
                var pathArray = req.files.image.path.split('/');

                res.send(util.format(' Task Complete \n uploaded %s (%d Kb) to %s as %s', req.files.image.name, req.files.image.size / 1024 | 0, req.files.image.path, req.body.title, req.files.image, '<img src="uploads/' + pathArray[(pathArray.length - 1)] + '">'));
            }
            // get house of given name
            HouseProfile.findOne({
                'name': houseName
            }, function(err, house) {
                // make sure house doens't exist
                if (!house) {
                    console.log('Hey we did not find a house');
                    var createHouse = new HouseProfile();
                    createHouse.name = houseName;
                    createHouse.desc = req.body.description;
                    createHouse.addr = req.body.addr;
                    createHouse.price = req.body.price;
                    // name of path will be housename
                    createHouse.maxRenters = req.body.maxt;
                    createHouse.owner = user;
                    if (req.files) {
                        // createHouse.picture.data = fs.readFileSync(tempPath);
                        // createHouse.picture.contentType = type;
                    }




                    // add the user to the database
                    createHouse.save(function(err) {
                        if (err) {
                            console.log('Error (could not save): ' + err);
                            throw err;
                        } else {
                            console.log('Added house succesfully' + createHouse);
                            return done;
                        }
                    });
                } else {
                    console.log('Error (house exists): ' + houseName);
                }
            });
        }
        process.nextTick(findOrCreateHouse);

    },

    // take in old name to avoid new one being changed
    editRental: function(req, done) {
        HouseProfile.findOneAndUpdate({
            _id: req.body.id
        }, {
            $set: {
                name: req.body.houseName,
                desc: req.body.description,
                maxRenters: req.body.maxt,
                addr: req.body.addr,
                price: req.body.price

                // Path to folder where images for house are stored
                //TODO update picture
            }
        }, function(err, update) {
            if (err) {
                throw (err);
            } else if (update == null) {
                throw new Error('user cannot be found');
            }
            update.save();
        });
    }
}