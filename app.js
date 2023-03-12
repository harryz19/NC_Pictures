const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

const userRouter = require("./routes/user.routes");
const appointmentRouter = require("./routes/appointment.routes");

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/appointment", appointmentRouter);

module.exports = app;
