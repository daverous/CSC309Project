var User = require('../models/user').model;
var Rating = require('../models/user').rmodel;
var util = require('util');

module.exports = {
	
	calcRating: function(profile){
		if (profile){
			if (profile.evaluations > 0){
				return profile.rating * 1.0 / profile.evaluations;
			} return 0;
		} return -1;
	}, 

	addRating: function(req, res, user){
		if (user._id == req.params.id){
			return;
		}

		user._ratings.find({rated_user: req.params.id}, function(err, result){
			if (err) {
                return console.error(err);
            }

            if (result){
            	User.find({_id: req.params.id}, function(err, rated){
            		if (err) return console.error(err);

            		if (rated){
            			rated.rating -= result.rating;
       					result.rating = req.body.rating;
       					rated.rating += result.rating;
       					rated.save;
       					result.save;
            		}
            	});
            } else{
            	User.find({_id: req.params.id}, function(err, rated){
            		if (err) return console.error(err);

            		if (rated){
       					result._ratings.push({rated_friend: rated._id, rating: req.body.rating});
       					rated.rating += req.body.rating;
       					rated.evaluations += 1;
       					rated.save;
       					result.save;
            		}
            	});
            }

		});
	}
}