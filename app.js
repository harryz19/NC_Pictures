const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();

const userRouter = require("./routes/user.routes");
const appointmentRouter = require("./routes/appointment.routes");

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

app.get("/confirmaccount", (req, res) => {
  res.sendFile(path.join(__dirname, "utils", "activate_account.html"));
});

app.use("/user", userRouter);
app.use("/appointment", appointmentRouter);

module.exports = app;
