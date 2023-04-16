const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  pid: { type: Number, required: true },
  uid: { type: Number, required: true },
  
  description: { type: String, required: false },
  locx: { type: Number, required: true },
  locy: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  formatdate: { type: Date, default: Date.now, required: true },
  imageurl: { type: String, required: false },
  status: { type: Boolean, default: false },
  department: { type: String, required: true },
});

module.exports = mongoose.model("reportproblem", newSchema);
