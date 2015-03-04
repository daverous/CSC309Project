var app = require("../app").app
var UserProfile = require('../models/user');
var HouseProfile = require('../models/house');
var Admin = require('../models/admin');

/*
	CP.js contains methods that help render the admin control panel
*/
module.exports = {
getUsers: function(){
	UserProfile.find({}, {}, function(err, users){
		if (err)
			//let the calling function handle error
			throw(err);
		//user retrieval is successful
		return users;

	});
},

getHouses: function(){
	HouseProfile.find({}, {}, function(err, houses){
		if (err)
			//let the calling function handle error
			throw(err);
		//user retrieval is successful
		return houses;
	});
}
};