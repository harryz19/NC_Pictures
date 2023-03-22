const Appointment = require("../models/appointment.model");

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const { title, description, lat, lng, address, price, starttime } =
      req.body;

    const appointment = new Appointment({
      title,
      description,
      lat,
      lng,
      address,
      price,
      starttime: new Date(starttime).getTime(),
      customer_id: req.user._id,
      customer_name: req.user.name,
      created_time: new Date().getTime(),
    });

    await appointment.save();
    return res.status(201).json({
      status: "success",
      message: "Appointment created successfully.",
      data: {},
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

// Appointment By Id for details
const appointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id });

    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    return res.status(200).json({
      status: "success",
      message: "",
      data: appointment,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

// Filter By Date Time
const appointmentsByCustomer = async (req, res) => {
  try {
    const { starttime, endtime } = req.body;
    const appointments = await Appointment.find({ customer_id: req.user._id })
      .where("starttime")
      .gt(starttime)
      .lt(endtime);

    return res.status(200).json({
      status: "success",
      data: appointments,
      message: "",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

//All appointments with no provider and itself
const appointmentsByProvider = async (req, res) => {
  try {
    const { status, starttime, endtime } = req.body;

    if (status === "pending") {
      const appointments = await Appointment.find({
        status,
      })
        .where("starttime")
        .gt(starttime)
        .lt(endtime);
      return res.status(200).json({
        status: "success",
        message: "",
        data: appointments,
      });
    } else if (status === "accepted") {
      const appointments = await Appointment.find({
        status,
        photographer_id: req.user._id,
      })
        .where("starttime")
        .gt(starttime)
        .lt(endtime);
      return res.status(200).json({
        status: "success",
        message: "",
        data: appointments,
      });
    } else if (status === "completed") {
      const appointments = await Appointment.find({
        status,
        photographer_id: req.user._id,
      })
        .where("starttime")
        .gt(starttime)
        .lt(endtime);
      return res.status(200).json({
        status: "success",
        message: "",
        data: appointments,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

// Status Update
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new Error("Please provide status.");
    }

    if (status === "accepted") {
      await Appointment.updateOne(
        { _id: req.params.id },
        {
          status,
          accepted_date: Date.now(),
          photographer_id: req.user._id,
          photographer_name: req.user.name,
        }
      );
    } else if (status === "completed") {
      await Appointment.updateOne(
        { _id: req.params.id },
        {
          status,
          completed_date: Date.now(),
          photographer_id: req.user._id,
          photographer_name: req.user.name,
        }
      );
    }
    return res.status(200).json({
      status: "success",
      data: {},
      message: "Status Updated Successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  appointmentById,
  appointmentsByCustomer,
  appointmentsByProvider,
  updateStatus,
};
