var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	password: String
});