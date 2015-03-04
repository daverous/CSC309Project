var util = require('util');
var mongoose = require('mongoose');
var userSchema = require('mongoose').model('User').schema;
var adminSchema = new Schema();
var UserProfile = require('user');
var HouseProfile = require('house');

util.inherits(adminSchema, userSchema);

adminSchema.methods.deleteUser = function(userid){
	UserProfile.remove({_id : userid}, function(err){
		if(err)
			throw(err);
	});
}
adminSchema.methods.deleteHouse = function(hid){
	HouseProfile.remove({_id : userid}, function(err){
		if(err)
			throw(err);
	});
}
adminSchema.methods.changeRating = function(userid, rating){
	UserProfile.findOne({_id : userid}, {}, function(err, profile){
		if (err)
			//let the calling function handle error
			throw(err);
		//user retrieval is successful
		profile.rating = rating;
		profile.save();

	});
}

module.exports = mongoose.model('Admin', adminSchema);