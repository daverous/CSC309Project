var app = require("../app").app
var UserProfile = require('../models/user');
var HouseProfile = require('../models/house');
var Admin = require('../models/admin');

/*
	CP.js contains methods that help render the admin control panel
*/

function getUsers(){
	UserProfile.find({}, {}, function(err, users){
		if (err)
			//let the calling function handle error
			throw(err);
		//user retrieval is successful
		profile.rating = rating;
		profile.save();

	});


})

function deleteUser(userid){
	UserProfile.remove({_id : userid}, function(err){
		if(err)
			throw(err);
	});
	
}