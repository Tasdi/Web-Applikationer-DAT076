var mocha   = require('mocha');
var assert  = require('assert');
var expect  = require('chai').expect;
var sinon = require('sinon');
var routes = require('../routes/index');
var User    = require('../models/user');
var Booking = require('../models/bookings');
var request = require('supertest');
var app     = require('../app');
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

before(function(done) {
    mockgoose.prepareStorage().then(function() {
        mongoose.connect('mongodb://dat076_project:rucus1@ds157439.mlab.com:57439/database_clinic', function(err) {
            done(err);
        });
    });
});


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

    it('Login page should be found', function(done) {
        request(app).post('/login')
        .expect(302, done);
    });

    it('Patient page should be found', function(done) {
        request(app).get('/patient')
        .expect(302, done);
    });

    it('Admin page should be found', function(done) {
        request(app).get('/admin')
        .expect(302, done);
    });

    it('Should not work', function(done) {
        request(app).get('/regist')
        .expect(404, done);
    });
});







