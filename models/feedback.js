const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  pid: { type: Number, required: true },
  desc: { type: String, required: true },
});

module.exports = mongoose.model("feedbackschema", newSchema);
