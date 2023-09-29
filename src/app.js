const express = require("express");
const user = require("./Routes/userRoute");
const cookieparser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieparser());

// User Ropute
app.use("/api/user", user);

module.exports = app;
