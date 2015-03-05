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


module.exports = mongoose.model('Admin', adminSchema);