var mongoose = require('mongoose');

module.exports = mongoose.model('House',{
	name: String,
	desription: String,
	// Path to folder where images for house are stored
	picture : { data: Buffer, contentType: String }

});