var HouseProfile = require('../models/house').model;
var util = require('util');
var fs = require('fs');
var bCrypt = require('bcrypt-nodejs');
var PassportLocalStrategy = require('passport-local').Strategy;


// var authenticate = require('auth');

module.exports = {
    findHousesByName: function (name) {
        HouseProfile.find({
            name: new RegExp(name, /^a/i)
        }, function (err, houses) {
            if (err) {
                return console.error(err);
            }
            return houses;
        });
    },

    findHousesForUser: function (username) {
        HouseProfile.find({
            owner: username
        }, function (err, houses) {

            if (err) {
                return console.error(err);
            }
            console.log("name" + username);
            console.log(houses);
            return houses;
        });

    },
    getTopRentals: function (req, done) {

        HouseProfile.find().sort({
                rating: 1
            }).limit(10),
            function (err, houses) {
                if (err) return console.error(err);
                return houses;
            }

    },

    addTennant: function (req, done) {
        var houseName = req.body.houseName;
        var newTennant = req.body.user;
        HouseProfile.findOne({
            'houseName': houseName
        }, function (err, house) {
            if (!house) {
                throw err;
            } else {
                house.currentRenters.push(newTennant);
            }

        })
    },
    //add rental
    addRental: function (req, done, user) {
        findOrCreateHouse = function () {

            console.log("user" + user);
            // var userName = req.param('username');
            // console.log(userName);
            var houseName = req.body.houseName;
            if (!houseName) {
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
            }, function (err, house) {
                if (!house) {

                    var createHouse = new HouseProfile();
                    createHouse.name = houseName;
                    createHouse.desc = req.body.description;
                    // name of path will be housename
                    createHouse.maxRenters = req.body.maxt;
                    createHouse.owner = user;
                    if (req.files) {
                        // createHouse.picture.data = fs.readFileSync(tempPath);
                        // createHouse.picture.contentType = type;




                        // add the user to the database
                        createHouse.save(function (err) {
                            if (err) {
                                console.log('Error (could not save): ' + err);
                                throw err;
                            } else {
                                console.log('Added house succesfully' + createHouse);
                                return done;
                            }
                        });
                    }
                } else {
                    console.log('Error (house exists): ' + houseName);
                }
            });
        }
        process.nextTick(findOrCreateHouse);

    },

    // take in old name to avoid new one being changed
    editRental: function (req, oldName, houseObj, userName, done) {
        // TODO make sure its not just name that is checked
        if (userName != houseObj.owner) {
            return false;
        }
        HouseProfile.update({
            'houseName': houseObj.houseName
        }, {
            name: houseObj.name,
            desription: houseObj.description,
            owner: houseObj.owner,
            rating: houseObj.rating,
            evaluations: houseObj.evaluations,
            maxRenters: houseObj.maxRenters,
            currentRenters: houseObj.currentRenters,
            // Path to folder where images for house are stored
            picture: houseObj.picture,
        });
    }
}