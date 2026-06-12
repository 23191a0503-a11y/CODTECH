const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  website: String,
  timeSpent: Number,
  productive: Boolean,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", LogSchema);
