const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const loggedinUser = await User.findById(decoded._id);

    if (!loggedinUser) {
      throw new Error("User logged out.");
    }
    req.user = loggedinUser;
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(400).json({
        status: "logout",
        data: "",
        message: "Session Expired.",
      });
    }
    return res.status(400).json({
      status: "error",
      data: "",
      message: error.message,
    });
  }
};

module.exports = auth;
