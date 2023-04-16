const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  did: { type: Number, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("department", newSchema);
