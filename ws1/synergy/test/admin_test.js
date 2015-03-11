var mongoose = require('mongoose');
var Admin = require('../models/admin').model;
var User = require('../models/user').model;
var House = require('../models/house').model;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var uid1 = mongoose.Types.ObjectId();
var uid2 = mongoose.Types.ObjectId();
var hid1 = mongoose.Types.ObjectId();
var hid2 = mongoose.Types.ObjectId();
var newRating = 2;

before(function (done) {
    mongoose.connect("mongodb://localhost/test");
    done();
});

after(function (done) {
    User.collection.drop();
    House.collection.drop();
    mongoose.connection.close(done);
});

describe('SHOULD', function () {

    before(function (done) {
        User.create({
            _id: uid1,
            firstName: "Fred",
            lastName: "Rubble",
            email: "blah",
            username: "blah",
            password: "1234",
            rating: 0
        }, {
            _id: uid2,
            firstName: "Barney",
            lastName: "Rubble",
            email: "blah",
            username: "blah",
            password: "1234",
            rating: 0
        });
        done();
    });

    it('should remove the user with uid1',
        function (done) {
            Admin.deleteUser(uid1);
            User.findOne({
                _id: uid1
            }, {}, function (err, user1) {
                should.not.exist(err);
                expect(user1).to.be.a('null');

            });
            User.findOne({
                _id: uid2
            }, {}, function (err, user2) {
                should.not.exist(err);
                should.exist(user2);
                user2.firstName.should.be.equal('Barney');
            });
            done();
        });
    it('should modify user with uid2s rating to newRating',
        function (done) {
            Admin.changeRating(uid2, newRating);
            User.findOne({
                _id: uid2
            }, {}, function (err, user2) {
                should.not.exist(err);
                should.exist(user2);
                user2.rating.should.be.equal(newRating);
                done();
            });
        });
});


describe('SHOULD', function () {
    before(function (done) {
        House.create({
            _id: hid1,
            name: "blah",
            description: "blah",
            owner: "blah",
            maxRenters: 1,
            currentRenters: ["blah"],
            picture: "blah"
        }, {
            _id: hid2,
            name: "blah",
            description: "blah",
            owner: "blah",
            maxRenters: 1,
            currentRenters: ["blah"],
            picture: "blah"
        });

        done();
    });

    it('should remove the house with hid1',
        function (done) {
            Admin.deleteHouse(hid1);
            House.findOne({
                _id: hid1
            }, {}, function (err, house1) {
                should.not.exist(err);
                expect(house1).to.be.a('null');
            });
            House.findOne({
                _id: hid2
            }, {}, function (err, house2) {
                should.not.exist(err);
                should.exist(house2);
            });
            done();

        });

});