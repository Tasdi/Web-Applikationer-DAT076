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
		index:true,
		required: true
	},
	startTime: {
		type: String,
		required: true
	},
	endTime: {
		type: String,
		required: true
	},
	patient: {
		type: String,
		required: true
	},
	isBooked: {
		type: Boolean,
		default: false,
		required: true
	}
});

var Booking = module.exports = mongoose.model('Booking', BookingSchema);

//Creates a booking and stores in database
module.exports.createBooking = function(newBooking, callback){
	 var checkdate = newBooking.date;
	 var checkstart = newBooking.startTime;
	 var checkend = newBooking.endTime;


	Booking.find({date: checkdate ,startTime: checkstart, endTime: checkend}, function(err, booking) 
	{
		if (err)
		{
			return handleError(err);
		}
		else if(!booking.length){
			newBooking.save(callback);
		}
		else
		{
			console.log(booking);
		}

	});


	 
}