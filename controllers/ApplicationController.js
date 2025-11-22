
const Application = require("../models/application");
const job = require("../models/job");
const cloudinary = require('cloudinary').v2;
const nodemailer = require("nodemailer");
cloudinary.config({
  cloud_name: 'dxatdsvqw',
  api_key: '473922139247129',
  api_secret: 'SK_AVgvTrcLgnj_JjUyGedsKsgo'
});
class ApplicationController {
  // POST /api/applications/:jobId
  static async applyJob(req, res) {
    try {
      const i = req.params.id;
      const { name, email, phone, status } = req.body;
      console.log("Hello");
      console.log(i);
      // Prevent duplicate application
      const alreadyApplied = await Application.findOne({
        job: i,
        applicant: req.user._id,
      });

      if (alreadyApplied) {
        return res.status(400).json({ message: "Already applied to this job" });
      }
      if (req.user) {
        console.log(req?.files);
        const file = req.files.file;
         
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
  folder: "profile",
          resource_type: "auto",
        format:"pdf"
});
        console.log("Hello");
        console.log(imageUpload);
        console.log(imageUpload.public_id);
        const job = await Application.create({
          name, email, phone, status, applicant: req.user._id, job: i, resume: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url
          }
        });
        res.status(201).json({ mesg: "applied" });
      }

      //res.status(201).json({ message: "Application submitted", application });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/applications/my
  static profilestatus = async (req, res) => {
    try {
      const dt = await Application.find({ applicant: req.user.id }).populate("job");
      res.json(dt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  // GET /api/applications/job/:jobId
  static async getJobApplications(req, res) {
    try {
      const apps = await Application.find({ job: req.params.jobId }).populate("applicant", "name email");

      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static applycard = async (req, res) => {
    try {
      console.log((req.user));
      
      const dt = await Application.find({ applicant: req.user.id }).select("job");
      const ar = dt.map((d) => d.job.toString());
      const a = await job.find({ _id: { $nin: ar } }).sort({ _id: -1 });
      res.json(a);
    
       
      }
    
    catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  }
  static applyscard = async (req, res) => {
    try {
      let { categoy, location } = req.body;
      console.log(categoy); 
       categoy = (!categoy || categoy.trim() === "") ? null : categoy;
    location = (!location || location.trim() === "") ? null : location;
      if (req.user) {
        console.log((req.user));
         const dt = await Application.find({ applicant: req.user.id }).select("job");
        const ar = dt.map((d) => d.job.toString());
        if (categoy && !location)
        {
           
          
          const ad = await job.find({ _id: { $nin: ar }, category: categoy });
          console.log(ad);
        return res.json(ad);
        }
        if (!categoy && location) {
          console.log("nfound");
           
          const ad = await job.find({ _id: { $nin: ar }, address: location });
          console.log(ad);
          return res.json(ad);
        }
        if (!categoy && !location)
        {
          console.log("ncategoy");
          const dt = await Application.find({ applicant: req.user.ID }).select("job");
          const ar = dt.map((d) => d.job.toString());
          const ad = await job.find({ _id: { $nin: ar }});
          return res.json(ad);
        }
         
           
          const ad = await job.find({ _id: { $nin: ar }, category: categoy, address: location });
          return res.json(ad);
        
      }
      else
      {  
        console.log("el");
        if (categoy && !location)
        { 
          const ad = await job.find({category: categoy });
          console.log(ad);
        return res.json(ad);
        }
        if (!categoy && location) {
          console.log("nfound");
           
          const ad = await job.find({address: location });
          console.log(ad);
          return res.json(ad);
        }
        if (!categoy && !location)
        {
          console.log("ncategoy"); 
          const ad = await job.find();
          return res.json(ad);
        }
         
            
        const ad = await job.find({ category: categoy, address: location });
        console.log(ad);
        return res.json(ad);
      }
      }
    
    catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  }
  static applied = async (req, res) => {
    try {
       
      const dt = await Application.find({ applicant: req.user.id }).populate("job");
      
      // const ar = dt.map((d) => d.job.toString());
      // const a = await job.find({ _id: { $in: ar } });
      console.log("applicant");
      console.log(dt);
      res.json(dt);
    }
    catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  }
  static viewapplicant = async (req, res) => {
    try {
       
      const dt = await Application.find({ job: req.params.id });
      console.log(dt);
      res.json(dt);
    }
    catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  }
  static status = async (req, res) => {
    try {
      const { status } = req.body;
      console.log(status);
      console.log("status");
      console.log(req.params.id);
      const dt = await Application.findByIdAndUpdate(req.params.id, { status },
        { new: true });
      const d = await Application.findById(req.params.id).populate("job");
      console.log("status");
      console.log(d);
      //console.log(dt);
      //this.func(req.user.email);
      res.json({ mesg: "approved" });
    }
    catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  }

  static func = async (email) => {
    let transporter = await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth:
      {
        user: "kratikashrivastava200@gmail.com",
        pass: "mdft dxjx amkt febh"
      }
    })
    let i = await transporter.sendMail({
      from: email,
      to: "kratikashrivastava200@gmail.com",
             
      subject: `regarding course`, // Subject line
      text: "Hello", // plain text body
      html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                 
                <div class="email-body">
                     
                    <p>Thank you. Your application is approved for further process.</p>
                     
                </div>
                 
            </div>
        </body>`
    })
  }
  static applicantcoun = async (req, res) =>
  {
    try
    {
      const posti = req.user.id;
      const dt = await Application.find().populate({ path:"job",populate:{path:"postedBy",model:"User"}});
      const d = dt.filter((p) => p.job?.postedBy?._id.toString() == posti.toString());
      console.log(d.length);
      const l = d.length;
      res.json(l);
    }
    catch (error)
    {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  }
}
module.exports = ApplicationController;