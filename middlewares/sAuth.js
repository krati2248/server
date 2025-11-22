const jwt = require("jsonwebtoken"); 
const User = require('../models/user');
const sAuth = async (req, res, next) => {
  console.log("sauth");
  try {
    
    const token = req.cookies.token; 
     
      if (!token)
      {
          req.user = null; 
        return next();
      }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.ID).select("-password");
     
    req.user = user;  
    next();
  } catch (error)
  { 
    req.user = null;
    next();
  }
};

module.exports = sAuth;