var express			= require('express');
var router			= express.Router();
var passport		= require('passport');
var LocalStrategy	= require('passport-local').Strategy;

var User			= require('../models/user');
var Booking			= require('../models/bookings');

/* Renders the homepage */
router.get('/', function(req, res){
	res.render('index', {title: 'MedicalClinic'});
});

/* Renders the page for a patient, uses an authenticated method so that a
patient cannot route to the page of admin */
router.get('/patient', ensureAuthenticateClient , function(req, res){
	res.render('patient', {title: req.user.name});
});

/* Renders the page for an admin, uses an authenticated method so that a
admin cannot route to the page of a patient */
router.get('/admin', ensureAuthenticateAdmin, function(req, res){
	res.render('admin', {title: req.user.name});
});

/*Ensures that admin cannot route to homepage of a client */
function ensureAuthenticateAdmin(req, res, next) {
	if(req.isAuthenticated() && req.user.isAdmin){
			return next();
	}
	req.flash('error_msg','You dont have the authorization');
	res.redirect('/');	
}

/*Ensures that patient cannot route to homepage of an admin */
function ensureAuthenticateClient(req, res, next) {
	if(req.isAuthenticated() && (!req.user.isAdmin)){
			return next();
	} 
	req.flash('error_msg','You dont have the authorization');
	res.redirect('/');
}

/*Renders registration page */
router.get('/register', function(req, res) {
	res.render('register', {title: 'Register'});
});

/* Post method to register a user. Uses validation check to see if all required fields are filled.
//Checks whether user already exist in the databse i.e. registered, if the password typed in for a user
//is correct, etc. */
router.post('/register', function(req, res){
	var name		= req.body.name;
	var email		= req.body.email;
	var username	= req.body.username;
	var password	= req.body.password;
	var password2	= req.body.password2;

	// Validation check
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		/* Checks if a username or email already exist and prints out message depending on the case.
		// We dont allow two users with same username or email or both. */
		User.getUserByUsername(username, function(err, user){
			User.getEmail(email, function(err, checkEmail) {
				if(err) {
					throw err;				
				} else if(user && checkEmail) {
					req.flash('error_msg', 'Username and email in use');
					res.redirect('/');
				} else if(user) {
					req.flash('error_msg', 'Username in use');
					res.redirect('/');
				} else if(checkEmail){
					req.flash('error_msg', 'Email in use');
					res.redirect('/');
				} else {
					var newUser = new User({
						name: name,
						email:email,
						username: username,
						password: password
					});

					User.createUser(newUser, function(err, user){
						if(err) {
							throw err;
						}
					});

					req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/');				
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
   		User.getUserByUsername(username, function(err, user){
   			if(err) throw err;
   			if(!user){
   				return done(null, false, {message: 'Unknown User'});
   			}

   			User.comparePassword(password, user.password, function(err, isMatch){
   				if(err) {
					throw err;
				}
   				if(isMatch){
   					return done(null, user);
   				} else {
   					return done(null, false, {message: 'Invalid password'});
   				}
   			});
   		});
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
  	if (err) { 
		return next(err); 
	}
    if (!user) {
		req.flash('error_msg', 'Incorrect username or password. Fill in the form below if you are not registered');
		return res.redirect('/register');
	}
    req.logIn(user, function(err) {
      if(err) {
		  return next(err);
	  }
	  if(req.user.isAdmin) {
		  return res.redirect('/admin');
	  } else {
		  return res.redirect('/patient');
	  }
      
    });
  })(req, res, next);
});

router.post('/showBookings', function(req, res){
	Booking.find({}).sort({startTime: 1})
    .then(function(doc) {
        res.render('admin', {booking: doc});
    });
});

router.post('/createBooking', function(req, res){
	var date		= req.body.datepicker;
	var startTime	= req.body.startTime;
	var endTime		= req.body.endTime;
//	var i			= 0;
	var bookings = {};
	// Validation check
	req.checkBody('datepicker', 'Date is required').notEmpty();
	req.checkBody('startTime', 'Start time is required').notEmpty();
	req.checkBody('endTime', 'End time is not valid').notEmpty();

	var errors = req.validationErrors();
	if(errors || startTime == endTime || endTime < startTime){
		res.render('admin',{
			errors:errors
		});
	} else {
		var result = (parseFloat(endTime.split(':')[0])) + (parseFloat(endTime.split(':')[1]) /60) - (parseFloat(startTime.split(':')[0])) + (parseFloat(endTime.split(':')[0] /60));
		endTime = startTime;

		for(var i = 0; i < result*2; i++) {

			if (endTime.includes("30")){
				endTime = endTime.replace("30", "00");
				if (parseInt(endTime) != 9){
					endTime = endTime.replace(parseInt(endTime), parseInt(endTime) + 1);
				} else {
					endTime = '10:00';
				}
			} else {
				endTime= endTime.replace('00', '30');
			}
			
			bookings[i] = new Booking({
				date: date,
				startTime: startTime,
				endTime: endTime,
				patient: "Unbooked"
			});
			
			Booking.createBooking(bookings[i], function(err, booking){
				if(err) {
					throw err;
				}
			});

			startTime = endTime;
		}

		req.flash('success_msg', 'Your bookings has been uploaded');
		res.redirect('/admin');
	}
});

router.post('/showPatients', function(req,res){
	User.find({'isAdmin': false}).then(function(doc) {
        res.render('admin', {patient: doc});
	});
});

router.get('/logout', function(req, res){
	req.logOut();
	req.flash('success_msg','You have been logged out');
	res.redirect('/');
});

router.post('/updateTable', function(req, res, next){
	Booking.update({'_id':req.body.id}, {$set:{
		date:req.body.date,
		startTime:req.body.startTime,
		endTime:req.body.endTime}}, function(err,result){
			if (err) {
				return handleError(err);
			}
			req.flash('success_msg', 'updated');
			res.redirect('/admin');
		});
});

router.post('/deleteBooking', function(req, res, next){
	Booking.remove({'_id':req.body.id}, function(err,result){
		if (err) {
			return handleError(err);
		}
		req.flash('success_msg', 'deleted');
		res.redirect('/admin');
	});
});

router.post('/showTable', function(req, res, next) {
	Booking.find({'patient': req.user.username})
    .then(function(doc) {
        res.render('patient', {items: doc});
    });
});

router.post('/bookTime', function(req, res, next) {
	Booking.find({'patient': "Unbooked"}).sort({startTime: 1})
    .then(function(doc) {
        res.render('patient', {bookings: doc});
    });
});

router.post('/bookIt', function(req, res, next){
	if(!req.user.hasBooked){
		Booking.update({'_id':req.body.id},{$set:{patient:req.user.username, isBooked:'true'}}, function (err, result) {	
			if (err) {
				return handleError(err);
			}
		});
		User.update({'_id':req.user.id},{$set:{hasBooked:'true'}}, function (err, result) {
			if (err) {
				return handleError(err);
			}
		});
		res.redirect('/patient');
	} else {
		req.flash('error_msg', 'You already booked one');
		res.redirect('/patient');
	}
});

router.post('/unbookIt', function(req, res, next){
	Booking.update({'_id':req.body.id},{$set:{patient:'Unbooked', isBooked:'false'}}, function (err, result) {
  		if (err) {
			return handleError(err);
		}
	});

	User.update({'_id':req.user.id},{$set:{hasBooked:'false'}}, function (err, result) {
  		if (err) {
			return handleError(err);
		}
	});
	res.redirect('/patient');
})
module.exports = router;