var mongoose = require('mongoose');

var mongodbUri = 'mongodb://dat076_project:rucus1@ds157439.mlab.com:57439/database_clinic';

mongoose.connect(mongodbUri);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {console.log("Booking connection successful")});

// Booking schema
var BookingSchema = mongoose.Schema({
	date: {
		type: String,
		index:true
	},
	startTime: {
		type: String
	},
	endTime: {
		type: String
	},
	patient: {
		type: String
	},
	isBooked: {
		type: Boolean,
		default: false
	}
});

var Booking = module.exports = mongoose.model('Booking', BookingSchema);

module.exports.createBooking = function(newBooking, callback){
	 newBooking.save(callback);
}