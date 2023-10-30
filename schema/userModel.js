const mongoose = require("mongoose");
const userProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    required: false,
  },
});

module.exports = mongoose.model("user", userProfileSchema);
