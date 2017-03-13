var mocha       = require('mocha');
var assert      = require('assert');
var expect      = require('chai').expect;
var sinon       = require('sinon');
var User        = require('../models/user');

describe('Test cases', function(){
    var testUser;

    it('Should be invalid if attributes of users are empty', function(done){
        var user = new User();
        user.validate(function(err){
            expect(err.errors.username).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.password).to.exist;
            expect(err.errors.name).to.exist;
            done();
        });
    });
    
    it('Tests if user can be stored', function(done){
        var user = new User({
            username: 'Tasdi'
        });

        assert(user.isNew === true);
        done();
    });
    
    it('Test to save a user to the database', function(done){
        testUser = new User({
            username: 'FromTest',
            password: 'bcrypt',
            email: 'from@test.js',
            name: 'InitialName',
            isAdmin: false
        });
    
        User.getUserByUsername(testUser.username, function(err, userName){
            if(err) {
                throw err;
            }
            if(!userName) {
                console.log('saving user');
                testUser.save().then(function(){
                    assert(testUser.isNew === false);
                });
            } else {
                console.log('User already in database');
            }
        });
           
       done();
    });

    it('Finds a user from the databse', function(done){
        User.findOne({name: 'Tasdi'}).then(function(result){
            assert(result.name === 'Tasdi');
            done();
        });
    });

    it('Updates email of the created user in test', function(done){
        User.findOneAndUpdate({email: 'from@test.js'}, {email: 'updated@test.js'}).then(function(){
            User.findOne({_id: testUser._id}).then(function(result){
                assert(result.name === 'updated@test.js');
                
            });
        });
        done();
    });

});