const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email already in use."],
  },
  password: {
    type: String,
  },
  mobile: {
    type: String,
    unique: [true, "Mobile number is already in use."],
  },
  profileImg: {
    type: String,
  },
  lat: Number,
  lng: Number,
  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ["customer", "provider"],
  },
  firebase_token: String,
  uid: String,
  social_login_type: {
    type: String,
    enum: ["google", "apple", "facebook"],
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;
  return userObject;
};

userSchema.methods.generateAuthtoken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
