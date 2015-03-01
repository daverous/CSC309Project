var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	firstName: String,
	lastName: String,
	email: String,
	username: String,
	password: String,
	rating: {type: Number, default: 0},
	evaluations: {type: Number, default: 0}
});