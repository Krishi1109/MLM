const User= require("../models/userModel")
const jwt = require("jsonwebtoken");

exports.authenticate = async(req,res,next) => {
    try {
        const token = req.cookies.login_token;
        const verifyToken = jwt.verify(token, process.env.SECRET);
        const loginUser = await User.findOne({ _id:verifyToken._id , });
    
        if (!loginUser) {
          return res.status(401).send({
            success: false,
            message: "Invalid User",
          });
        }

        req.token = token;
        req.loginUser = loginUser;
        req.UserID = loginUser._id;
    
        next();
      } catch (err) {
        return res.status(401).send({
          success: false,
          login : false,
          message: "Unauthorized : No token provided...",
        });
      }
}