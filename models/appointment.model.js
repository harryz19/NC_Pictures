const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customer_name: String,
  photographer_name: String,
  customer_id: { type: mongoose.Types.ObjectId, ref: "user" },
  photographer_id: { type: mongoose.Types.ObjectId, ref: "user" },
  lat: Number,
  lng: Number,
  address: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },
  title: {
    type: String,
    required: [true, "Title is required."],
  },
  description: {
    type: String,
    required: [true, "Description is required."],
  },
  starttime: Number,
  completed_time: Number,
  created_time: Number,
  accepted_time: Number,
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
});

const Appointment = mongoose.model("appointment", appointmentSchema);
module.exports = Appointment;
