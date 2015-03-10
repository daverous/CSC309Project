var mongoose = require('mongoose');

var houseSchema = new mongoose.Schema({name: String,
	desription: String,
	owner: String,
	rating: {type: Number, default: 0},
	evaluations: {type: Number, default: 0},
	maxRenters: Number,
	currentRenters: {
		type:[String]},
	// Path to folder where images for house are stored
	picture : { data: Buffer, contentType: String}
});

houseSchema.statics.list = function(callback){
	this.find(function(err, houses){
		if(err){
			return(err, null);
		}
		else{
			callback(null, houses);
		}
	});
}

var House = mongoose.model('House', houseSchema);

module.exports = {
	schema: houseSchema,
	model: House
};
