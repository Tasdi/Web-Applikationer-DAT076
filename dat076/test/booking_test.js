var mocha       = require('mocha');
var assert      = require('assert');
var expect      = require('chai').expect;
var sinon       = require('sinon');
var Booking     = require('../models/bookings');

describe('Test cases', function(){
    var testBooking;
    
    it('Should be invalid if attributes of bookings are empty', function(done){
        var booking = new Booking();
        booking.validate(function(err){
            expect(err.errors.date).to.exist;
            expect(err.errors.startTime).to.exist;
            expect(err.errors.endTime).to.exist;
            expect(err.errors.patient).to.exist;
            done();
        });
    });

    it('Tests if bookings can be stored', function(done){
        var booking = new Booking({
            date: '03/08/2015'
        });

        assert(booking.isNew === true);
        done();
    });

    it('Test to save a booking to the database', function(done){
        testBooking = new Booking({
            date: '03/08/2015',
            startTime: '10:00',
            endTime: '11:00',
            patient: 'Libaani',
            isBooked: false
        });

        testBooking.save().then(function(){
        });
       done();
    });

    it('Finds a booking from the databse', function(done){
        Booking.findOne({date: '03/08/2015', startTime: '10:00', endTime: '11:00'}).then(function(result){
            assert(result.date === '03/08/2015');
            assert(result.startTime === '10:00');
            assert(result.endTime === '11:00');
            done();
        });
    });

    it('Updates created time in database', function(done){
        Booking.findOneAndUpdate({startTime: '10:00'}, {startTime: '10:30'}).then(function(){
            Booking.findOne({_id: testBooking._id}).then(function(result){
                assert(result.startTime === '10:30');
            });
        });
        done();
    });

});