var mongoose = require('mongoose');

var ratingSchema = new mongoose.Schema({
    rated_friend: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number
    }
});

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    joined: {
        type: Date, default: Date.now
    }, 
    rating: {
        type: Number,
        default: 0
    },
    evaluations: {
        type: Number,
        default: 0
    },
    _friends: [{
        _id: { type: mongoose.Schema.ObjectId, ref: 'User' },
        firstName : { type: String, ref: 'User'},
        lastName : { type: String, ref: 'User'},
        email: { type: String, ref: 'User'},
        username: { type: String, ref: 'User'},
        rating: {type: Number, default: 0, ref: 'User'},
        evaluations: {type: Number, default: 0, ref: 'User'},
        deleted: {type: Boolean, default: false}
    }],
    _ratings: [ratingSchema],
    role: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

userSchema.statics.list = function (callback) {
    this.find({deleted : false}, function (err, users) {
        if (err) {
            return (err, null);
        } else {
            callback(null, users);
        }
    });
}

var User = mongoose.model('User', userSchema);
var Rating = mongoose.model('Rating', ratingSchema);

module.exports = {
    schema: userSchema,
    model: User,
    rschema: ratingSchema,
    rmodel: Rating
};
