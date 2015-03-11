var HouseProfile = require('../models/house').model;
var util = require('util');
var fs = require('fs');
var bCrypt = require('bcrypt-nodejs');
var PassportLocalStrategy = require('passport-local').Strategy;
var UserProfile = require('../models/user');


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
    getTopRentals: function(req, done) {

        HouseProfile.find().sort({
            rating: 1
        }).limit(10),
        function(err, houses) {
            if (err) return console.error(err);
            return houses;
        }

    },

    addTennant: function(req, done, user) {
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
                house.currentRenters.push(user);
                house.save;
            }

        })
    },
    //add rental
    addRental: function(req, done, user) {
        findOrCreateHouse = function() {

            console.log("user" + user);
            console.log(req.body.houseName);
            // var userName = req.param('username');
            // console.log(userName);
            var houseName = req.body.houseName;
            if (!houseName) {
                console.log('I am finished');
                return done;
            }
            if (req.files) {
                console.log('file info: ', req.files.image);

                //split the url into an array and then get the last chunk and render it out in the send req.
                var pathArray = req.files.image.path.split('/');

                res.send(util.format(' Task Complete \n uploaded %s (%d Kb) to %s as %s', req.files.image.name, req.files.image.size / 1024 | 0, req.files.image.path, req.body.title, req.files.image, '<img src="uploads/' + pathArray[(pathArray.length - 1)] + '">'));
            }




            // function(req, houseObj, done){
            //  // TODO make sure its not just name that is checked
            HouseProfile.findOne({
                'name': houseName
            }, function(err, house) {
                if (!house) {
                    console.log('Hey we did not find a house');
                    var createHouse = new HouseProfile();
                    createHouse.name = houseName;
                    createHouse.desc = req.body.description;
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
                maxRenters: req.body.maxt

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