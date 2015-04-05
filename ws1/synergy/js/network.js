var User = require('../models/user').model;
var Rating = require('../models/user').rmodel;
var House = require('../models/house').model;
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
		if (!user){
      return;
    }else if (user._id == req.params.id){
			return;
		}

    var result = null;

    for (var i=0; i < user._ratings.length; i++){
      if (user._ratings[i].rated_friend == req.params.id){
        result = user._ratings[i];
      }
    }

    if (result){
      User.findById(req.params.id, function(err, rated){
        if (err) return console.error(err);

        if (rated){
          rated.rating -= result.rating;
          result.rating = req.body.rating;
          rated.rating += result.rating;
          rated.save();
          result.save();
        }
      });
    } else{
      User.findById(req.params.id, function(err, rated){
        if (err) return console.error(err);

        if (rated){
          user._ratings.push({rated_friend: rated._id, rating: req.body.rating});
          rated.rating += req.body.rating;
          rated.evaluations += 1;
          rated.save();
          user.save();
        }
      });
    }

		/*user._ratings.find({rated_friend: req.params.id}, function(err, result){
			if (err) {
                return console.error(err);
            }

            if (result){
            	User.findById(req.params.id, function(err, rated){
            		if (err) return console.error(err);

            		if (rated){
            			rated.rating -= result.rating;
       					result.rating = req.body.rating;
       					rated.rating += result.rating;
       					rated.save();
       					result.save();
            		}
            	});
            } else{
            	User.findById(req.params.id, function(err, rated){
            		if (err) return console.error(err);

            		if (rated){
       					result._ratings.push({rated_friend: rated._id, rating: req.body.rating});
       					rated.rating += req.body.rating;
       					rated.evaluations += 1;
       					rated.save();
       					result.save();
            		}
            	});
            }

		});*/
	},

  findUsers: function(house){
        return house.currentRenters;
  },
  /*
	findUsers: function(house){
        var renters = house.currentRenters;
        var objects = new Array(house.currentRenters.length);

        for (var i = 0; i < renters.length; i++){
            User.findOne({username: renters[i]}, function(err, result){
                if (err) return console.error(err);
                objects[i] = result;
            })
        }

        return objects;
    },
  */
    unique: function(array, currentUser) {
      var result = array.concat();
      var remove = -1;

      for(var i=0; i<result.length; ++i) {
        for(var j=i+1; j<result.length; ++j) {
          if(result[i] === result[j])
            result.splice(j--, 1);
          if(result[j].username == currentUser)
            remove = j;
        }
      }

      if (j > -1) result.splice(remove, 1);

      return result;
    }
}