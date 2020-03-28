const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  bio: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
});

const profile = mongoose.model("profile", profileSchema);

module.exports = profile;
