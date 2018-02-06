const express = require("express");
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require("multer");
var upload = multer();
var User = require("./models/user.js");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);


//setup view engine
app.set('view engine', 'ejs');

//connect to db

mongoose.connect("mongodb://localhost/voting");

mongoose.connection.once('open', function(){
	console.log("Connection made. Now for fireworks... ");
}).on("error", function(error){
	console.log("Connection error: " + error);
})

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

//setup static files
app.use('/assets', express.static('assets'));

//setup port
app.listen(process.env.port || 3000);
console.log('Now listening to requests.');




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

app.post('/poll', upload.array(), function(req, res, next){

	var pollData = {
		question: req.body.question,
		items: []
	};
	for(var i = 0; i< req.body.item.length; i++){

		pollData.items.push([req.body.item[i], 0]);

	}
	console.log(pollData);
	console.log(req.session.userId)

	User.findOne({_id:req.session.userId}, function(error, user){
		user.polls.push(pollData);
		user.save()
	});
	
});
		


//logout functionality

app.get('/logout', function(req, res,next){
	if(req.session){
		//delete session object
		req.session.destroy(function(err){
			if(err){
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});


//setup landing page
app.get('', function(req, res){
	var signup ='<a class="nav-link" href="#" data-toggle="modal" data-target="#modal-sign">Sign-Up</a>';
	var login = '<a class="nav-link" href="#" data-toggle="modal" data-target="#modal-login">Login</a>';
	var logout = '<a class="nav-link" href="/logout">Logout</a>';

	User.findById(req.session.userId).
	exec(function(error, user){
		if(error){
			return next(error)
		} else if (req.session&&user!=null){
			var name = '<a class="nav-link" href="#">' + user.username + '</a>'
			res.render('index', {session: true, name: name, email: user.email, login: login,  logout: logout, signup: signup})
		} else {
			res.render('index', {session: false, login: login,  logout: logout, signup: signup})
		}
	});
});


//setup dashboard page
app.get('/vote', function(req, res){
	User.findById(req.session.userId)
	.exec(function (error, user){
		if(error){
			return next(error);
		} else {
			console.log(user);
			res.render('vote', {name: user.username, email: user.email});
		}
	})



	
	
});


