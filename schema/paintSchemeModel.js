const mongoose = require("mongoose");

const paintSchemeSchema = new mongoose.Schema({
  scheme_name: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("paintScheme", paintSchemeSchema);
