var util = require('util');
var mongoose = require('mongoose');
var User = require('./user').model;
var HouseProfile = require('./house').model;

var adminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
});

adminSchema.statics.deleteUser = function(userid){
	User.remove({_id : userid}, function(err){
		if(err)
			throw(err);
	});
}
adminSchema.statics.deleteUsers = function(users, userids, deletes, callback){
	deleted = [];
	var j = 0;
	for(var i = 0; i < users.length; i++){
		if(deletes[i] == 1){
			console.log(userids[i]);
			adminSchema.statics.deleteUser(userids[i]);
			deleted[j] = i;
			j++;
		}
	}
	callback(deleted);	
}
adminSchema.statics.deleteHouse = function(hid){
	HouseProfile.remove({_id : hid}, function(err){
		if(err)
			throw(err);
	});

	return hid;
}
adminSchema.statics.deleteHouses = function(hids, deletes, callback){
	console.log(deletes);
	var j = 0;
	for(var i = 0; i < hids.length; i++){
		if(deletes[i] == 1){
			console.log(hids[i]);
			adminSchema.statics.deleteHouse(hids[i]);
			j++;
		}
	}
}
adminSchema.statics.changeRating = function(userid, rating){
	User.findOneAndUpdate({_id : userid}, {$set: {rating: rating}}, function(err, update){
		if(err){
			throw(err);
		}
		else if(update == null){
			throw new Error('user cannot be found');
		}
		update.save();
		});
}
adminSchema.statics.changeRatings = function(users, userids, ratings){
	for(var i = 0; i < users.length; i++){
		if(users[i] == 1){
			try{
				adminSchema.statics.changeRating(userids[i], ratings[i]);
			}catch(err){
				console.log(err.message);
			}
		}
	}
}
var Admin = mongoose.model('Admin', adminSchema);

module.exports = {
	schema: adminSchema,
	model: Admin
};
