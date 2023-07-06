const mongoose = require("mongoose");
const newSchema = mongoose.Schema({
  pid: { type: Number, required: true },
  name: { type: String, required: true },
});
module.exports = mongoose.model("solvername", newSchema);
