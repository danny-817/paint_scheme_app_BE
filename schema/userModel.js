const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email_address: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		// Custom validator for email format
		validate: {
			validator: function (v) {
				// Regular expression to match email format
				return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
			},
			message: (props) => `${props.value} is not a valid email address!`,
		},
	},
	security_answers: {
		type: [String],
		required: true,
	},
});

module.exports = mongoose.model("user", userSchema);
