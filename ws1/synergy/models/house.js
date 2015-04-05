var mongoose = require('mongoose');

var houseSchema = new mongoose.Schema({
    name: String,
    desc: String,
    owner: String,
    created:{
        type: Date, default: Date.now
    },
    addr:String,
    price: Number,
    phone: String,
    rating: {
        type: Number,
        default: 3
    },
    evaluations: {
        type: Number,
        default: 0
    },
    maxRenters: Number,
    currentRenters: [{
        _id: { type: mongoose.Schema.ObjectId, ref: 'User' },
        firstName : { type: String, ref: 'User'},
        lastName : { type: String, ref: 'User'},
        email: { type: String, ref: 'User'},
        username: { type: String, ref: 'User'},
        rating: {type: Number, default: 0, ref: 'User'},
        evaluations: {type: Number, default: 0, ref: 'User'}
    }],
    // Path to folder where images for house are stored
    picture: {
        data: Buffer,
        contentType: String
    }
});

houseSchema.statics.list = function (callback) {
    this.find(function (err, houses) {
        if (err) {
            return (err, null);
        } else {
            callback(null, houses);
        }
    });
}

var House = mongoose.model('House', houseSchema);

module.exports = {
    schema: houseSchema,
    model: House
};
