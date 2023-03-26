const Appointment = require("../models/appointment.model");
const User = require("../models/users.model");
const FirebaseNotify = require("../utils/notifications");

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
      photographer_id: null,
      photographer_name: null,
      accepted_time: 0,
      completed_time: 0,
    });

    await appointment.save();

    const photographers = await User.find({ role: "photographer" });

    photographers.forEach((photographer) => {
      FirebaseNotify({
        to: photographer.firebase_token,
        priority: "high",
        notification: {
          title: "hello",
          body: "notification successfull",
          sound: "default",
        },
      });
    });

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
      data: { appointment },
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

    const appointments = await Appointment.find({
      customer_id: req.user._id,
      $or: [
        {
          created_time: {
            $gte: new Date(starttime).getTime(),
            $lt: new Date(endtime).getTime(),
          },
        },
        {
          starttime: {
            $gte: new Date(starttime).getTime(),
            $lt: new Date(endtime).getTime(),
          },
        },
        {
          completed_time: {
            $gte: new Date(starttime).getTime(),
            $lt: new Date(endtime).getTime(),
          },
        },
        {
          accepted_time: {
            $gte: new Date(starttime).getTime(),
            $lt: new Date(endtime).getTime(),
          },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      data: { appointments },
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
        $or: [
          {
            created_time: {
              $gte: new Date(starttime).getTime(),
              $lt: new Date(endtime).getTime(),
            },
          },
          {
            starttime: {
              $gte: new Date(starttime).getTime(),
              $lt: new Date(endtime).getTime(),
            },
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        message: "",
        data: { appointments },
      });
    } else if (status === "accepted") {
      const appointments = await Appointment.find({
        status,
        photographer_id: req.user._id,
        $or: [
          {
            accepted_time: {
              $gte: new Date(starttime).getTime(),
              $lt: new Date(endtime).getTime(),
            },
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        message: "",
        data: { appointments },
      });
    } else if (status === "completed") {
      const appointments = await Appointment.find({
        status,
        photographer_id: req.user._id,
        $or: [
          {
            completed_time: {
              $gte: new Date(starttime).getTime(),
              $lt: new Date(endtime).getTime(),
            },
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        message: "",
        data: { appointments },
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
          accepted_time: new Date().getTime(),
          photographer_id: req.user._id,
          photographer_name: req.user.name,
        }
      );
    } else if (status === "completed") {
      await Appointment.updateOne(
        { _id: req.params.id },
        {
          status,
          completed_time: new Date().getTime(),
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
