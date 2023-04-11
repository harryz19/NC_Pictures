const nodemailer = require("nodemailer");

const sendMail = async (email, message) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  let mailDetails = {
    from: `NC Pictures <${process.env.GOOGLE_USER}>`,
    to: email,
    subject: "NC Pictures - Activate Account",
    text: `${message} This link is valid for only 10 minutes and Please don't share this mail with anyone.`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully.");
    }
  });
};

module.exports = {
  sendMail,
};
