var mocha = require('mocha');
var assert = require('assert');
var expect = require('chai').expect;
var User = require('../models/user');
var Booking = require('../models/bookings');
var request = require('supertest');
var app = require('../app');

describe('test cases', function(){
    //Create test for user
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

    //Create test for booking
    it('another test', function(done){
        var booking = new Booking();
        booking.validate(function(err){
            expect(err.errors.date).to.exist;
            expect(err.errors.startTime).to.exist;
            expect(err.errors.endTime).to.exist;
            expect(err.errors.patient).to.exist;
            done();
        });
    });
});

describe('Routing tests', function(){
    //Testing 'get' of homepage
    it('Testing get function of homepage', function(done){
        request(app).get('/')
        .expect(200)
        .expect(/MedicalClinic/, done);
    });

    //Testing 'get' of registration page
    it('Testing get function of registration', function(done) {
        request(app).get('/register')
        .expect(200)
        .expect(/Register/, done);
    });
});