const axios = require("axios");

const FirebaseNotify = async (data) => {
  try {
    return await axios.post("https://fcm.googleapis.com/fcm/send", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "key=AAAAsdk5j2k:APA91bHeXlVyBJk5_n-J8QNvJwjwALedWfeZ4g0sb9xem4-o73HbsStFrHPRcBHiQ1VMXPuxd0jZCgZHpg00uFg09VEDhx5uS-lM1UWPNWhI_oJ5GwZ16ROQp7UogqCafwWgVM-VBUQM",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = FirebaseNotify;
