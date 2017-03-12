var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongodbUri = 'mongodb://dat076_project:rucus1@ds157439.mlab.com:57439/database_clinic';

mongoose.Promise = global.Promise;
mongoose.createConnection(mongodbUri);

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {console.log("User connection successful")});

//User Schema, attributes that gets stored 
//in database if a user is successfully registered
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		default: false,
		required: true
	},
	hasBooked: {
		type: Boolean,
		default: false,
		required: true
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//Hashes the password of a newly created user
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
			newUser.isAdmin	 = false;
	        newUser.save(callback);
	    });
	});
}

//Queries the databse to find name of a user
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

//Queries the databse to get ID of a user
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

//Determines whether a user on database is admin or patient
module.exports.getStatus = function(isAdmin, callback){
	var query = {isAdmin: isAdmin};
	User.findOne(query, callback);
}

//Checks that the typed in passwords are the same
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) {
			throw err;
		}
    	callback(null, isMatch);
	});
}