var fs = require ('fs.extra');

var bCrypt = require('bcrypt-nodejs');
var PassportLocalStrategy   = require('passport-local').Strategy;
var HouseProfile = require('../models/house');
var UserProfile = require('../models/user');

var tempPath = './public/images/temp.png';

exports.createHouse =  function(req, house, password, done) { var houseName = house.name;
	var description = house.description;
	var uploadedfilepath = req.files.image.path;
	var uploadedfilename = req.files.image.originalFilename;
	var image = req.files.image;

	var uploadedfilepathsplit= req.files.image.path.split('/');
	var newPath = __dirname +'/public/images/' + uploadedfilepathsplit[(uploadedfilepathsplit.length - 1)];
	var imageSrc = uploadedfilepathsplit[(uploadedfilepathsplit.length - 1)];

	//console.log("NEW PATH: " +newPath);
	fs.copy(uploadedfilepath, newPath, function(err) {
		if(err) {
			console.log(err);
			throw err;
		}
		fs.unlink(uploadedfilepath, function() {
			if (err) throw err;
		});

	});

	function(req, house, done) {

		findOrCreateHouse = function(){
			HouseProfile.findOne({ 'houseName' :  houseName }, function(err, user) {
				if (!house) {

					var createHouse = new HouseProfile();
					createHouse.houseName = house.houseName;
					createHouse.description = req.param('description');
						// name of path will be housename
						createHouse.picture.data = fs.readFileSync(tempPath);
						createHouse.contentType



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
					}

				process.nextTick(findOrCreateHouse);
				});
		}
	}

}