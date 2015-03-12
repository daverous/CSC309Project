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
        lastName : { type: String, ref: 'User'}
    }],
    _ratings: [ratingSchema],
    //It's possible for a tenant to also be an owner?
    role: {
        type: Number,
        default: 0
    }
    //isOwner: Boolean,
    //isAdmin: Boolean
});

userSchema.statics.list = function (callback) {
    this.find(function (err, users) {
        if (err) {
            return (err, null);
        } else {
            callback(null, users);
        }
    });
}

userSchema.statics.getUser = function(username, callback){
    this.findOne({username : username}, function(err, user){
        if(err){
            return (err, null);
        } else{
            callback(null, user);
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