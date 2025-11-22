const express = require("express");
const JobController = require("../controllers/JobController");
const ApplicationController = require("../controllers/ApplicationController");
const UserController = require("../controllers/UserController.js");
const auth = require("../middlewares/auth.js");
const sAuth = require("../middlewares/sAuth.js"); 
const router = express.Router();


router.post("/applyscard", (req, res, next) => { console.log("apply scard"); next(); }, sAuth, ApplicationController.applyscard);
router.post("/type", sAuth, JobController.ftype);

///auth login
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/me", auth, UserController.getProfile);
router.get("/userdt",auth, UserController.userdt);
router.put("/editprofile", auth, UserController.editprofile);
router.post("/fget", UserController.fget);
router.get("/reset-password", UserController.reset_password);
router.post("/reset-password", UserController.reset_Pswd);
//JobController

router.get("/getjobs", JobController.getAllJobs);                // Public
router.get("/jobview/:id", JobController.getJobById);             // Public
router.put("/jobupdate/:id", auth, JobController.updateJob);        // Recruiter only
router.delete("/jobdelete/:id", auth, JobController.deleteJob);     // Recruiter only
router.post("/postjob",auth,JobController.createJob)
router.get("/getpost", auth, JobController.getpost);
router.put("/editpost/:id", JobController.editpost);
router.delete("/deletepost/:id", JobController.deletepost);
router.post("/catname", auth, JobController.catname); 
//appliction
// Apply to job
router.post("/:jobId", auth, ApplicationController.applyJob);
router.get("/jobdetail/:id", JobController.jobdetail);


// Get all applications for a job (recruiter)
router.get("/job/:jobId", auth, ApplicationController.getJobApplications);
router.post("/applyjob/:id", auth, ApplicationController.applyJob);
router.get("/view/:id", ApplicationController.viewapplicant);
router.get("/profilestatus", ApplicationController.profilestatus);
router.get("/applycard", auth, ApplicationController.applycard);
router.get("/applied", auth, ApplicationController.applied);
router.post("/status/:id",auth, ApplicationController.status);
router.get("/applicantcoun", auth, ApplicationController.applicantcoun);
 
router.get("/dispost", auth, JobController.dispost);
router.get("/cate", JobController.cate);





module.exports = router;