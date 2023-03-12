const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customer_name: String,
  provider_name: String,
  customer_id: mongoose.Types.ObjectId,
  provider_id: mongoose.Types.ObjectId,
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
  starttime: Date,
  completed_time: Date,
  created_time: Date,
  accepted_date: Date,
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
});

const Appointment = mongoose.model("appointment", appointmentSchema);
module.exports = Appointment;
