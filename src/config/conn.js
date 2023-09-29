const mongoose = require("mongoose");
const DB_URL = process.env.URI;

const connectDatabase = () => {
  mongoose
    .connect(DB_URL)
    .then((data) => {
      console.log("Database Connection Successful...!!");
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectDatabase;
