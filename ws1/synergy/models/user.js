var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	password: String,
	rating: {type: Number, default: 0},
	evaluations: {type: Number, default: 0},
	_friends: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
	//It's possible for a tenant to also be an owner?
	role: {type: Number, default: 0}
});

userSchema.statics.list = function(callback){
	this.find(function(err, users){
		if(err){
			return(err, null);
		}
		else{
			callback(null, users);
		}
	});
}

var User = mongoose.model('User', userSchema);

module.exports = {
	schema: userSchema,
	model: User
};