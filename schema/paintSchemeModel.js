const mongoose = require("mongoose");
// const paintNameSchema = new mongoose.Schema({
//   paint_name: { type: String },
// });

// const paintStepSchema = new mongoose.Schema({
//   paint_step: { type: String },
// });
const paintSchemeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  scheme_name: {
    type: String,
    required: true,
  },
  scheme_for: {
    type: String,
    required: false,
  },
  paint_list: {
    type: [String],
    required: false,
    uniqueItems: true,
  },
  steps: {
    type: [String],

    required: false,
    uniqueItems: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("paintscheme", paintSchemeSchema);
