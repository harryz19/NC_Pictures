const {
  createAppointment,
  updateStatus,
  appointmentById,
  appointmentsByCustomer,
  appointmentsByProvider,
  allocateAppoitment,
} = require("../controllers/appointment.controllers");

const auth = require("../middlewares/auth");

const router = require("express").Router();

router.post("/create", auth, createAppointment);
router.patch("/updatestatus/:id", auth, updateStatus);
router.get("/appointmentbyid/:id", auth, appointmentById);
router.post("/appointmentbycustomer", auth, appointmentsByCustomer);
router.post("/appointmentsbystatus", auth, appointmentsByProvider);
router.post("/allocateappointment",auth, allocateAppoitment);

module.exports = router;
