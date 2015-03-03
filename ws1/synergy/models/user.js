var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	password: String,
	rating: {type: Number, default: 0},
	evaluations: {type: Number, default: 0},
	//role is either 0 for tenant or 1 for owner. 
	//It's possible for a tenant to also be an owner?
	role: {type: Number, default: 0},
	isAdmin: {type: Boolean, default: false}
});