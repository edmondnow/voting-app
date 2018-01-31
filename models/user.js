const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PollSchema = new Schema({
	question: {
		type: String,
		required: [true, 'Question field is required']
	},

});


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
});

const User = mongoose.model('user', UserSchema);

module.exports = User;

