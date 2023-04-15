const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { sendMail } = require("../utils/mailsend");

// Register User
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
    const existMobile = await User.findOne({ mobile });

    if (existingUser || existMobile) {
      throw new Error("User with this email or mobile already exists.");
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
      firebase_token: "",
    });

    await user.save();

    const baseURL =
      "https://ncpictures.onrender.com" || "http://localhost:8000";
    const URL = `${baseURL}/confirmaccount?uid=${
      user._id
    }&ts=${Date.now().valueOf()}`;
    const message = `Open this link to activate account: <a href=${URL}>Activate your account</a>`;
    sendMail(email, message);

    return res.status(201).json({
      status: "success",
      data: {},
      message: "Registered successfully.",
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      data: {},
      message: error.message,
    });
  }
};

// Activate Account
const activateAccount = async (req, res) => {
  try {
    const { timestamp, uid } = req.body;
    // if (Date.now().valueOf() - timestamp < 600000) {
    const user = await User.findOne({
      _id: uid,
    });

    if (!user) {
      throw new Error("User not found.");
    }

    user.accountStatus = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "Your account activated succesfully." });
    // } else {
    //   return res.status(400).json({ message: "This link is expired." });
    // }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password, firebase_token } = req.body;

    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      throw new Error("User not found.");
    }

    if (loginUser.accountStatus === false) {
      throw new Error("Your email is not verifed.");
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);

    if (!isMatch) {
      throw new Error("Incorrect Password.");
    }

    loginUser.firebase_token = firebase_token;
    await loginUser.save();
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
    const {
      name,
      email,
      profileImg,
      lat,
      lng,
      social_login_type,
      uid,
      firebase_token,
    } = req.body;

    if (social_login_type !== "apple") {
      const user = await User.findOne({ email });
      if (user) {
        user.firebase_token = firebase_token;
        await user.save();
        const token = user.generateAuthtoken();
        return res.status(200).json({
          status: "success",
          data: { user: user.toJSON(), token },
          message: "",
        });
      }
    } else if (social_login_type === "apple") {
      const exUser = await User.findOne({ uid });
      const exEmail = await User.findOne({ email });

      if (exEmail) {
        throw new Error("User with this email already registered.");
      }

      if (exUser) {
        exUser.firebase_token = firebase_token;
        await exUser.save();
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
      role: "",
      firebase_token: firebase_token,
      mobile: null,
      address: null,
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

    const user = await User.findOne({
      _id: userid,
      social_login_type: "apple",
    });

    if (user) {
      return res.status(200).json({
        status: "success",
        data: {},
        message: "User account delete successfully",
      });
    }

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
  activateAccount,
  loginUser,
  socialLogin,
  updateMobile,
  deleteUser,
};
