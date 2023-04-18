const mongoose = require("mongoose");
const { Schema } = mongoose;

const dataSchema = new Schema({
  pid: { type: Number, required: true },
  uid: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  formatdate: { type: Date, default: Date.now, required: true },
  imageurl: { type: String, required: false },
  status: { type: Boolean, default: false },
  department: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
});

dataSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("problem", dataSchema);
