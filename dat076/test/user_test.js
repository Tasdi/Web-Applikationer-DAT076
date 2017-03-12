var mocha       = require('mocha');
var assert      = require('assert');
var expect      = require('chai').expect;
var sinon       = require('sinon');
var User        = require('../models/user');

describe('Test cases', function(){
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
        var user = new User({
            username: 'FromTest',
            password: 'bcrypt',
            email: 'from@test.js',
            name: 'Test a test that is tested',
            isAdmin: false
        });
    
        User.getUserByUsername(user.username, function(err, userName){
            if(err) {
                throw err;
            }
            if(!userName) {
                console.log('saving user');
                user.save().then(function(){
                    assert(user.isNew === false);
                });
            } else{
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

});