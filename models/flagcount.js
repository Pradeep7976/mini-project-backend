const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  pid: { type: Number, required: true },
  flags: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("flagcount", newSchema);
