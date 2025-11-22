const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
  },
   vacancy: {
      type: Number,
      required: true,
  }, 
  type: {
    type: String,
    enum: ['full time', 'part time'],
     required: true
  },
  duration: {
      type: String, 
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirement: {
      type: String,
      required: true,
  },
    category: {
      type: String,
      required: true,
  },
  logo: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  last_date:
  {
    type: Date,
    required:true
  },
  role:
  {
    type: String,
    required:true
  },
  stip:
  {
    type: String,
    required:true
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   
},{ timestamps: true });

module.exports = mongoose.model("Job",jobSchema);