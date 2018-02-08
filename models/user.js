const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


const PollSchema = new Schema({
	question: {
		type: String,
		required: [true, 'Question field is required']
	},

	items: [{pollItem: String, pollCount: Number}]

})


const UserSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Name field is required'],
		minlength: 6,
		maxlength: 15
	},

	email: {
		type: String,
		required: [true, 'Email field is required']
	},

	password: {
		type: String,
		required: [true, 'Password field is required'],
		minlength: 8
	},
	passwordConf: {
		type: String,
		required: [true, 'Password field is required'],
		minlength: 8
	},

	polls: [{question: {type: String, required: [true, 'Question is required']}, items: []}]
});


//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
   User.findOne({ email: email })
     .exec(function (err, user) {
       if (err) {
         return callback(err)
       } else if (!user) {
         var err = new Error('User not found.');
         err.status = 401;
         return callback(err);
       }
       bcrypt.compare(password, user.password, function (err, result) {
         if (result === true) {
           return callback(null, user);
         } else {
           return callback();
         }
       })
     });
 }


//hashing a password before saving it to the database
UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.password, 10, function(err, hash){
		if (err) {
			return next(err);
		}

		user.password = hash;
		next();
	});

});

//hashing a passwordConf before saving it to the database
UserSchema.pre('save', function(next){
	var user = this;
	bcrypt.hash(user.passwordConf, 10, function(err, hash){
		if (err) {
			return next(err);
		}

		user.passwordConf = hash;
		next();
	});

});

const User = mongoose.model('User', UserSchema);

module.exports = User;

