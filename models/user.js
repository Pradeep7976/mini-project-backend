const mongoose = require("mongoose");

const newSchema = mongoose.Schema({
  uid: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  imageurl: { type: String, required: false },
});

module.exports = mongoose.model("regester", newSchema);
