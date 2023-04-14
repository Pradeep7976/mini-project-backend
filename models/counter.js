const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, required: true },
  pid: { type: Number, required: true },
});

module.exports = mongoose.model("counter", newSchema);
