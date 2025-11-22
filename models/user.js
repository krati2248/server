const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email:
    {
        type: String,
        unique: true
    },
    password: String,
    role:
    {
        type: String,
        enum: ["jobseeker", "recruiter", "admin"],
        default: "jobseeker"
    },
    phone:
    {
        type: Number,
        required:false
    },
    token: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User",userSchema);