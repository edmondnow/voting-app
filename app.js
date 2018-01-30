const express = require("express");
const app = express();
const fs = require('fs');

app.set('view engine', 'ejs');

app.get('', function(req, res){
	res.render('index'); //pass later objects collected from poll collection
});


//setup static files
app.use('/assets', express.static('assets'));

app.listen(process.env.port || 3000);
console.log('Now listening to requests.');