const express = require("express");
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require("multer");
var upload = multer();
var userModel = require("./models/user.js");

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

app.post('/sign',  upload.array(), function(req, res, next){
	var signData = new userModel({		
		"username": req.body.username,
		"email":req.body.email,
		"password": req.body.password
	});

	signData.save();
})

//setup dashboard page
app.get('/dashboard', function(req, res){
	res.render('dashboard'); //pass later objects collected from poll collection
});