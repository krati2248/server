const Job = require("../models/job");
const cloudinary = require('cloudinary').v2;
const Application = require("../models/application");
cloudinary.config({
  cloud_name: 'dxatdsvqw',
  api_key: '473922139247129',
  api_secret: 'SK_AVgvTrcLgnj_JjUyGedsKsgo'
});
class JobController {
  // POST /api/jobs
  static async createJob(req, res) {
    try {
      const { name, address, type, description, requirement, duration, vacancy, category, last_date, role, stip } = req.body;
      const h = await Job.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        role:{$regex:new RegExp(`^${role}$`,"i")}
      });
      if (h)
      {
        return res.status(400).json({ message: "This role already exists" });
      }
      if (req.user) {
        console.log(req?.files);
        const file = req.files.logo;
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "profile"
        })
        const job = await Job.create({
          name, address, type, description, requirement, duration, postedBy: req.user.id,vacancy,last_date,role,stip, logo: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url
          },category
        });
        res.status(201).json(job);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/jobs
  static async getAllJobs(req, res) {
    try {
      const jobs = await Job.find().populate("postedBy", "name email");
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  // GET /api/jobs/:id
  static async getJobById(req, res) {
    try {
      const job = await Job.findById(req.params.id).populate("postedBy", "name email");
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/jobs/:id
  static async updateJob(req, res) {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/jobs/:id
  static async deleteJob(req, res) {
    try {
      await Job.findByIdAndDelete(req.params.id);
      res.json({ message: "Job deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static getpost = async (req, res) => {
    try {
      const id = req.user.id;
      console.log(id);
      const coun = await Job.countDocuments({ postedBy: id });
      console.log(coun);
      res.json({ coun });
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
  static jobdetail = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const dt = await Job.findById(id);
      console.log(dt);
       res.json( dt );
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
  static dispost = async (req, res) =>
  {
    try
    {
      const dt = await Job.find({ postedBy: req.user.id });
      res.json(dt);
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
  static catname = async (req, res) =>
  {
    try
    {
      const { category } = req.body;
      console.log(req.body);
      const d = await Application.find({ applicant: req.user.id }).select("job");
      const a = d.map((elet) => elet.job);
      const dt = await Job.find({ category, _id: { $nin: a } }).sort({ _id: -1 });
      console.log("category");
      console.log(dt);
      res.json(dt);
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
  static editpost = async (req, res) =>
  {
    try
    {
      const id = req.params.id;
      const { name, address, type, description, requirement, duration, vacancy, category } = req.body;
      const d = await Job.findById(id);
      let logoPublicId = d.logo.public_id;
      let logoUrl = d.logo.url;
      if (req.files && req.files.logo) {
        const file = req.files.logo;
        if (logoPublicId) {
          await cloudinary.uploader.destroy(logoPublicId);
        }
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "profile",
        });

        logoUrl = imageUpload.secure_url;
        logoPublicId = imageUpload.public_id;
      }
         
        const dt = await Job.findByIdAndUpdate(id, {
          name, address, type, description, requirement, duration,vacancy, logo: {
            public_id:  logoPublicId,
            url: logoUrl
          },category
        });
        
        res.json({mesg:"updated"});
        
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
  static deletepost = async (req, res) =>
  {
    try
    {
      await Job.findByIdAndDelete(req.params.id);
      res.json({mesg:"delete"});
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
   static ftype = async (req, res) => {
  try {
    let { type, categoy, location } = req.body;

    if (categoy === "") categoy = null;
    if (location === "") location = null;

    const userId = req.user?.ID || req.user?.id;
 
    let applid = [];
    if (userId) {
      const applied = await Application.find({ applicant: userId }).select("job");
      applid = applied.map(j => j.job);
    }

    let query = {};
 
    if (userId) {
      query._id = { $nin: applid };
    }
 
    if (type && type !== "all") query.type = type;
    if (categoy) query.category = categoy;
    if (location) query.address = location;

    const p = await Job.find(query).sort({ _id: -1 });

    return res.status(200).json(p);
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

  static cati = async (req, res) =>
  {
    try
    {
      const p = await Job.aggregate([
        {
          $group: {
            _id: "$category",
            coun: { $sum: 1 }
          }
        }
      ]);
      res.status(200).json(p);
    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }
  static cate = async (req, res) =>
  {
    try
    {
      const cdDt = await Job.find();
      console.log(cdDt);
      res.status(200).json(cdDt);
    }
    catch (error)
    {
      res.status(401).json({ mesg: error.message });
    }
  }
}

module.exports = JobController;