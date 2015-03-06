
var HouseProfile = require('../models/house');
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
	getTopRentals : function(req,username, done){

		HouseProfile.find().sort( { rating: 1} ).limit(10), function(err, houses) {
			if (err) return console.error(err);
			return houses;
		}

	},

	//add rental
	addRental : function (req, done) { 
		findOrCreateHouse = function() {

			if (req.files) {
				var uploadedfilepath = req.files.image.path;
				var uploadedfilename = req.files.image.originalFilename;
				var houseName = req.param('houseName');
				var image = req.files.image;
				var type = req.files.type;

				var uploadedfilepathsplit= req.files.image.path.split('/');
				var tempPath = __dirname +'/public/images/temp';
				fs.writeFile(tempPath, data, function (err) {
					res.redirect("back");
				});

		//console.log("NEW PATH: " +newPath);
		fs.copy(uploadedfilepath, newPath, function(err) {
			if(err) {
				console.log(err);
				throw err;
			}
			fs.unlink(uploadedfilepath, function() {
				if(err) {
					console.log(err);
					throw err;
				}			});

		});
	}
		// function(req, houseObj, done){
		// 	// TODO make sure its not just name that is checked
		HouseProfile.findOne({ 'houseName' :  houseName }, function(err, house) {
			if (!house) {

				var createHouse = new HouseProfile();
				createHouse.houseName = houseName;
				createHouse.description = req.param('description');
							// name of path will be housename
							createHouse.maxRenters = req.param('maxRenters');
							createHouse.picture.data = fs.readFileSync(tempPath);
							// createHouse.contentType = m



							// add the user to the database
							createHouse.save(function(err) {
								if (err){
									console.log('Error (could not save): ' + err);  
									throw err;  
								}
								console.log('Added house succesfully');    
								return done(null, createHouse);
							});
						}
						else {
						   // TODO add editing
						   console.log('Error (house exists): ' + house.houseName);
						   return done(null, false, req.flash('message','Error: That housename has already been taken'));
						}});
	}
	process.nextTick(findOrCreateHouse);;

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





