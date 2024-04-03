const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		require: true,
	},
	password: {
		type: String,
		required: true,
	},
	email_address: {
		type: String,
		required: true,
	},
	security_answers: {
		type: [String],
		required: true,
	},
});

module.exports = mongoose.model("user", userSchema);
