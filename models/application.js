const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    name: String,
    email:
    {
        type: String,
        required: true
    },
    phone:
    {
        type: String,
        required: true
    },
    resume:
    {
      public_id: {
      type: String,
      required: true
      },
      url: {
      type: String,
      required: true
      }
    },
    job:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    applicant:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    appliedAt:
    {
        type: Date,
        default: Date.now
    },
    status:
    {
        type: String,
        required: true,
        default:"applied"
    }
});

module.exports = mongoose.model("Application", applicationSchema);