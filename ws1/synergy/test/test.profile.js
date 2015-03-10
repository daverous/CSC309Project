var should = require("should");
var mongoose = require('mongoose');
var UserProfile = require('../models/user.js');

var db;

describe('UserProfile', function() {

	before (function(done) {
		db = mongoose.connect("mongodb://localhost/test");
		done();
	});

	after (function(done) {
		mongoose.connection.close();
		done();	
	});

	beforeEach (function(done) {
		var temp = new UserProfile();
		temp.username = "user123467890";
                temp.password = "user123467890";
		temp.firstName = "user123467890";
		temp.lastName = "user123467890";
		temp.email = "user123467890@gmail.com";

		temp.save(function(err) {
                    if (err){
                        console.log('Error (could not save): ' + err);
                        throw err;
                    }
                    console.log('Added user: ' + temp.username + ' succesfully');
                    done();
                });
	});

	it('find using username', function (done) {
		UserProfile.findOne({username: 'user123467890'}, function (err, temp) {
			temp.username.should.eql('user123467890');
			console.log('username: ', temp.username);
			done();
		});
	});

	afterEach (function (done) {
		UserProfile.remove({}, function () {
			done();
		});
	});
});
