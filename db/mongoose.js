const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL_LOCAL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB Connected.");
  })
  .catch((err) => {
    console.log(err);
  });
