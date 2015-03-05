var mongoose = require('mongoose');

var houseSchema = new mongoose.Schema({name: String,
	desription: String,
	owner: String,
	maxRenters: Number,
	currentRenters: {
		type:[String]},
	// Path to folder where images for house are stored
	picture : { data: Buffer, contentType: String}
});

var House = mongoose.model('House', houseSchema);

module.exports = {
	schema: houseSchema,
	model: House
};