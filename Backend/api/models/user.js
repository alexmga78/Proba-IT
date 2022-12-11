const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
		required: true,
		// unique: true
		match: /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@stud.acs.pub.ro$/
	},
	username: {
		type: String,
		required: true,
		// unique: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('user', userSchema);
