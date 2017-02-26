var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Booking = require('../models/bookings');

router.get('/', function(req, res){
	res.render('index', {title: 'MedicalClinic'});
});

router.get('/user', function(req, res){
	res.render('user', {title: 'User'});
});

// Register
router.get('/register', function(req, res){
	res.render('register', {title: 'Register'});
});


router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

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
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/');
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
   				if(err) throw err;
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

router.post('/login',
  passport.authenticate('local', {successRedirect:'/user', failureRedirect:'/register',failureFlash: true}),
  function(req, res) {
    res.render('user');
})

router.post('/user', function(req, res){
	var date		= req.body.datepicker;
	var startTime	= req.body.startTime;
	var endTime		= req.body.endTime;


	// Validation check
	req.checkBody('datepicker', 'Date is required').notEmpty();
	req.checkBody('startTime', 'Start time is required').notEmpty();
	req.checkBody('endTime', 'End time is not valid').notEmpty();

	var errors = req.validationErrors();
	if(errors || startTime == endTime){
		res.render('user',{
			errors:errors
		});
	} else {
		var newBooking = new Booking({
			date: date,
			startTime: startTime,
			endTime: endTime,
			patient: "none"
		});

		Booking.createBooking(newBooking, function(err, booking){
			if(err) throw err;
			console.log(booking);
		});

		req.flash('success_msg', 'Your booking has been uploaded');
		res.redirect('/user');
	}
});

router.get('/logout', function(req, res){
	req.logOut();
	req.flash('success_msg','You have been logged out');
	res.redirect('/');
});

router.get('/showTable', function(req, res, next) {
  Booking.find({'patient': "none"})
      .then(function(doc) {
        res.render('user', {items: doc});
      });
});

module.exports = router;