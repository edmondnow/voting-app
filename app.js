const express = require("express");
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require("multer");
const upload = multer();
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const chart = require('chart.js');
const lint = require('ejs-lint');
const bodyParser = require('body-parser');



app.use(bodyParser.json({ extended: true }));

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

var signup ='<a class="nav-link" href="#" data-toggle="modal" data-target="#modal-sign">Sign-Up</a>';
var login = '<a class="nav-link" href="#" data-toggle="modal" data-target="#modal-login">Login</a>';
var logout = '<a class="nav-link" href="/logout">Logout</a>';


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
				return res.redirect('/create');
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
				return res.redirect('/create')
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

		pollData.items.push({item: req.body.item[i], votes: 0});

	}
	

	User.findOne({_id:req.session.userId}, function(error, user){
		user.polls.push(pollData);
		user.save()
	});

	res.redirect('/mypolls');
	
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

app.get('/polls', function(req, res){
	if(JSON.stringify(req.query)!=='{}'){
		userId = req.query.user;
	} else {
		userId = req.session.userId;
	};

	User.find({_id: userId}).exec(function(error, data){	
		res.writeHead(200, {"Content-Type":"text/json"});	
		var dataString = JSON.stringify(data);
		res.end(dataString);
		 	
	});

});

app.get('/pollsshow', function(req, res){
	User.findOne({'polls._id': req.query.pollid}, function(error, data){	
		console.log(data);
		res.writeHead(200, {"Content-Type":"text/json"});	
		var dataString = JSON.stringify(data);
		res.end(dataString);
	});



})

//setup mypolls page
app.get('/mypolls', function(req, res, next){
	console.log(req.session.userId);
	User.findById(req.session.userId)
	.exec(function (error, user){
		if(error){
			console.log(error);
		}  else if (req.session&&user!=null){
			var name = '<a class="nav-link" href="#">' + user.username + '</a>'
			res.render('mypolls', {session: true, name: name, email: user.email, login: login,  logout: logout, signup: signup})
		} else {
			res.render('mypolls', {session: false, login: login,  logout: logout, name: signup})
		}
	})
})



//setup landing page
app.get('', function(req, res){
	

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


app.get('/pollpage*', function(req, res){
	var userId;
	var pollId = req.query.pollid ;
	if(req.session.id === null || req.session.id === undefined ){
		userId = req.query.user;
	} else {
		userId = req.session.userId;
	}

	User.findOne({'polls._id': req.query.pollid}, function(error, user){
		if(error){
			console.log(error);
		} else if (req.session.userId!=undefined){	
			var name = '<a class="nav-link" href="#">' + user.username + '</a>'
			res.render('pollpage', {session: true, name: name, email: user.email, login: login,  logout: logout, signup: signup})
		} else {
			res.render('pollpage', {session: false, login: login,  logout: logout, name: signup})
		}
	})
});

app.get('/pollupdate',  function(req, res){
		var itemIndex = req.query.index;
		var pollId = req.query.pollId;
		User.findOne({'polls._id': pollId}, function(err, user){
			if(err){
				console.log(err);
			} else {
				for(var i = 0; i<user.polls.length; i++){
					if(user.polls[i]._id == pollId){
						user.polls[i].items[itemIndex].votes++;
						user.save();
						res.send(user);
					}
				}
			};

		});
});
		
	
	
//Delete function for my polls

app.get('/delete', function(req, res){
	console.log(JSON.stringify(req.query.pollid) + ' this is it')
	User.findOne({'polls._id': req.query.pollid}, function(error,user){
		if(error){
			console.log(error);
		} else {
			console.log(user);
			for(var i = 0; i<user.polls.length; i++){
				if(user.polls[i]._id == req.query.pollid){
					console.log('success');
					user.polls.splice(i,1);
					user.save();
					res.send('poll was deleted');

				}
			}
		}
	});
})


//setup dashboard page
app.get('/create', function(req, res){
	User.findById(req.session.userId)
	.exec(function (error, user){
		if(error){
			return next(error);
		}  else if (req.session.userId!=null){
			var name = '<a class="nav-link" href="#">' + user.username + '</a>'
			res.render('create', {session: true, name: name, email: user.email, login: login,  logout: logout, signup: signup})
		} else {
			res.render('create', {session: false, login: login,  logout: logout, name: signup})
		}
	})



	
	
});


