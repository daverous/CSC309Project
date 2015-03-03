var UserProfile = require('../models/user');

/*
	Admin.js contains methods that allow a systems administrator to make the following changes:

	Change User Rating
	Delete Users 
*/

function changeRating(userid, rating){
	UserProfile.findOne({_id : userid}, {}, function(err, profile){
		if (err)
			//let the calling function handle error
			throw(err);
		//user retrieval is successful
		profile.rating = rating;
		profile.save();

	});


})

function deleteUser(userid){
	UserProfile.remove({_id : userid}, function(err){
		if(err)
			throw(err);
	});
	
}