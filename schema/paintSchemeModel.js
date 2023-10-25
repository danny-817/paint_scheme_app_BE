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
    type: [paintNameSchema],
    require: false,
    uniqueItems: true,
  },
  steps: {
    type: [paintStepSchema],

    require: false,
    uniqueItems: true,
  },
  notes: {
    type: String,
    require: false,
  },
});

exports = mongoose.model("paintscheme", paintSchemeSchema);
