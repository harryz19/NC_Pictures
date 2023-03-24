const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Regitser User
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      profileImg,
      lat,
      lng,
      address,
      role,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User with email Id already exists.");
    }

    if (!password) {
      throw new Error("Password is required.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      profileImg,
      lat,
      lng,
      address,
      role,
    });

    await user.save();

    return res.status(201).json({
      status: "success",
      data: {},
      message: "User registered successfully.",
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);

    if (!isMatch) {
      throw new Error("Incorrect Password.");
    }
    const token = loginUser.generateAuthtoken();
    return res.status(200).json({
      status: "success",
      data: { user: loginUser.toJSON(), token },
      message: "",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", data: {}, message: error.message });
  }
};

// Social Login
const socialLogin = async (req, res) => {
  try {
    const { name, email, profileImg, lat, lng, social_login_type, uid } =
      req.body;

    if (social_login_type !== "apple") {
      const user = await User.findOne({ email });
      if (user) {
        const token = user.generateAuthtoken();
        return res.status(200).json({
          status: "success",
          data: { user: user.toJSON(), token },
          message: "",
        });
      }
    } else if (social_login_type === "apple") {
      const exUser = await User.findOne({ uid });
      if (exUser) {
        const token = exUser.generateAuthtoken();
        return res.status(200).json({
          status: "success",
          data: { user: exUser.toJSON(), token },
          message: "",
        });
      }
    }

    const newUser = new User({
      name,
      email,
      profileImg,
      lat,
      lng,
      social_login_type,
      uid,
    });

    await newUser.save();
    const token = newUser.generateAuthtoken();
    return res.status(201).json({
      status: "success",
      data: { user: newUser.toJSON(), token },
      message: "",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", data: {}, message: error.message });
  }
};

// Update Mobile and Address
const updateMobile = async (req, res) => {
  try {
    const { mobile, address, role } = req.body;

    if (!mobile || !address || !role) {
      throw new Error("Please provide mobile, address and role.");
    }

    const user = req.user;
    user.mobile = mobile;
    user.address = address;
    user.role = role;

    await user.save();

    return res.status(200).json({
      status: "success",
      data: { user: user.toJSON() },
      message: "Details updated successfully.",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", data: {}, message: error.message });
  }
};

// Delete User Account
const deleteUser = async (req, res) => {
  try {
    const userid = req.user._id;

    await User.deleteOne({ _id: userid });

    return res.status(200).json({
      status: "success",
      data: {},
      message: "User account delete successfully",
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
  registerUser,
  loginUser,
  socialLogin,
  updateMobile,
  deleteUser,
};
