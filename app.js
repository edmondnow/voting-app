const express = require("express");
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require("multer");
var upload = multer();
var User = require("./models/user.js");
var session = require("express-session");


//use sessions for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false

}))

//setup view engine
app.set('view engine', 'ejs');

//connect to db

mongoose.connect("mongodb://localhost/voting");

mongoose.connection.once('open', function(){
	console.log("Connection made. Now for fireworks... ");
}).on("error", function(error){
	console.log("Connection error: " + error);
})

//setup static files
app.use('/assets', express.static('assets'));

//setup port
app.listen(process.env.port || 3000);
console.log('Now listening to requests.');


//setup landing page
app.get('', function(req, res){
	res.render('index'); //pass later objects collected from poll collection
});


//setup registration and login
app.post('/', upload.array(), function(req, res, next){
	//confirm that user typed same password
	if(req.body.password !== req.body.passwordConf){
		var err = new Error('Passwords do not match.');
		err.status = 400;
		res.send("passwords don't match");
		return next(err);
	}

	if(req.body.email && req.body.username && req.body.password && req.body.passwordConf){
		var userData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
			passwordConf: req.body.passwordConf
		}

		User.create(userData, function(error, user){
			if(error){
				return next(error);
			} else {
				req.session.userId = user._id;
				return res.redirect('/vote');
			}
		});
	} else if (req.body.logemail && req.body.logpassword){
		User.authenticate(req.body.logemail, req.body.logpassword, function(error, user){
			if(error || !user){
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/vote')
			}
		});
	} else {
		var err = new Error('ALl fields required.');
		err.status = 400;
		return next(err);
	}
});



//setup dashboard page
app.get('/vote', function(req, res){
	console.log(req.session.usedId);
	/*
	User.findById(req.session.userId)
	.exec(function (error, user){
		if(error){
			return next(error);
		} else {
			res.render('vote', {name: user.name, email: user.email});
		}
	})
	*/
	res.render('vote');
	
});


