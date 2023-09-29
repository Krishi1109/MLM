const app = require("./src/app")
const dotenv = require("dotenv").config();
const connectDatabase = require("./src/config/conn");
const error = require("./src/middleware/ErrorMiddleware/error");

connectDatabase()

app.use(error);

app.listen(process.env.PORT, () => {
  console.log(`Connection is live on port number ${process.env.PORT}`);
});
