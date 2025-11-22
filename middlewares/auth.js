const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // token cookies se uthaya
    // console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.ID).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid user" });
    }

    req.user = user; // user ko req me attach karo
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = auth;