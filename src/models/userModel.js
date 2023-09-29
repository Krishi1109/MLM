const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    referance: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    children: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
