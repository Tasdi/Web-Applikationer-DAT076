var mocha = require('mocha');
var assert = require('assert');
var expect = require('chai').expect;
var User = require('../models/user');
//Describe test
describe('test cases', function(){
    //Create tests
    it('should be invalid if attributes are empty', function(done){
        var user = new User();
        user.validate(function(err){
            expect(err.errors.username).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.password).to.exist;
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('another test', function(done){
        //......
        done();
    });

});