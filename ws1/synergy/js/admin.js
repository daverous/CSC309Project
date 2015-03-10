var app = require("../app").app
var UserProfile = require('../models/user').model;
var HouseProfile = require('../models/house').model;
var Admin = require('../models/admin');

/*
	admin.js contains methods that help render the admin control panel
*/
module.exports = {
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