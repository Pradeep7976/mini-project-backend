const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  uid: { type: Number, required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
});

module.exports = mongoose.model("rating", newSchema);
