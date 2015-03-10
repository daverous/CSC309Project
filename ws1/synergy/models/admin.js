var util = require('util');
var mongoose = require('mongoose');
var User = require('./user').model;
var adminSchema = mongoose.Schema();
var HouseProfile = require('./house').model;

util.inherits(adminSchema, User);

adminSchema.statics.deleteUser = function(userid){
	User.remove({_id : userid}, function(err){
		if(err)
			throw(err);
	});
}
adminSchema.statics.deleteUsers = function(users, userids, deletes){
	for(var i = 0; i < users.length; i++){
		if(users[i] == 1 && deletes[i] == 1){
			adminSchema.statics.deleteUser(userids[i]);
		}
	}
}
adminSchema.statics.deleteHouse = function(hid){
	HouseProfile.remove({_id : hid}, function(err){
		if(err)
			throw(err);
	});
}
adminSchema.statics.changeRating = function(userid, rating){
	User.findOneAndUpdate({_id : userid}, {$set: {rating: rating}}, function(err, update){
		if(err){
			throw(err);
		}
		update.save();
		});
}
adminSchema.statics.changeRatings = function(users, userids, ratings){
	for(var i = 0; i < users.length; i++){
		if(users[i] == 1){
			adminSchema.statics.changeRating(userids[i], ratings[i]);
		}
	}
}
var Admin = mongoose.model('Admin', adminSchema);

module.exports = {
	schema: adminSchema,
	model: Admin
};
