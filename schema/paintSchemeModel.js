const mongoose = require("mongoose");
const paintNameSchema = new mongoose.Schema({
	paint_name: { type: String },
});

const paintStepSchema = new mongoose.Schema({
	paint_step: { type: String },
});
const paintSchemeSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
	},
	scheme_name: {
		type: String,
		require: true,
	},
	scheme_for: {
		type: String,
		require: false,
	},
	paint_list: {
		type: [String],
		require: false,
	},
	steps: {
		type: [String],

		require: false,
	},
	notes: {
		type: String,
		require: false,
	},
});

module.exports = mongoose.model("paintscheme", paintSchemeSchema);
