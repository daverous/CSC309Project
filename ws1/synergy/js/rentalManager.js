
var HouseProfile = require('../models/house');
var util = require('util');
var fs = require('fs');
var bCrypt = require('bcrypt-nodejs');
var PassportLocalStrategy   = require('passport-local').Strategy;
var UserProfile = require('../models/user');

// var authenticate = require('auth');

module.exports = {

	findHousesForUser : function(req,username, done){
		HouseProfile.find({ owner: username }, function(err, houses) {
			if (err) return console.error(err);
			return houses;
		});

	},
	getTopRentals : function(req, done){

		HouseProfile.find().sort( { rating: 1} ).limit(10), function(err, houses) {
			if (err) return console.error(err);
			return houses;
		}

	},

	//add rental
	addRental : function (req, done) { 
		findOrCreateHouse = function() {

				// console.log(req);
				
				var houseName = req.body.houseName;
				if (req.files) {
					 console.log('file info: ',req.files.image);
 
        //split the url into an array and then get the last chunk and render it out in the send req.
        var pathArray = req.files.image.path.split( '/' );
 
        res.send(util.format(' Task Complete \n uploaded %s (%d Kb) to %s as %s'
            , req.files.image.name
            , req.files.image.size / 1024 | 0
            , req.files.image.path
            , req.body.title
            , req.files.image
            , '<img src="uploads/' + pathArray[(pathArray.length - 1)] + '">'
            ));
			}
				

			

		// function(req, houseObj, done){
		// 	// TODO make sure its not just name that is checked
		HouseProfile.findOne({ 'houseName' :  houseName }, function(err, house) {
			if (!house) {

				var createHouse = new HouseProfile();
				createHouse.houseName = houseName;
				// createHouse.description = req.body.params['description'];
							// name of path will be housename
							createHouse.maxRenters = req.body.maxtenents;
							if (req.files) {
							// createHouse.picture.data = fs.readFileSync(tempPath);
							// createHouse.picture.contentType = type;
							}



							// add the user to the database
							createHouse.save(function(err) {
								if (err){
									console.log('Error (could not save): ' + err);  
									throw err;  
								}
								else {
									console.log('Added house succesfully');    
									return done;
								}
							});
						}
						else {
						   console.log('Error (house exists): ' + houseName);
						}});
	}
	process.nextTick(findOrCreateHouse);

},

		// take in old name to avoid new one being changed
		editRental : function (req, oldName, houseObj, userName ,done){
		// TODO make sure its not just name that is checked
		if  (userName != houseObj.owner) {
			return false;
		}
		HouseProfile.update({ 'houseName' :  houseObj.houseName }, {
			name: houseObj.name,
			desription: houseObj.description,
			owner: houseObj.owner,
			rating: houseObj.rating,
			evaluations:houseObj.evaluations,
			maxRenters: houseObj.maxRenters,
			currentRenters: houseObj.currentRenters,
		// Path to folder where images for house are stored
		picture : houseObj.picture,
	}
	);
	}
}





