var mongoose = require('mongoose');

module.exports = mongoose.model('House',{
	name: String,
	desription: String,
	owner: String,
	rating: {type: Number, default: 0},
	evaluations: {type: Number, default: 0},
	maxRenters: Number,
	currentRenters: {
		type:[String]},
	// Path to folder where images for house are stored
	picture : { data: Buffer, contentType: String }

});