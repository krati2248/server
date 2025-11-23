const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
dotenv.config();
JWT_SECRET=process.env.JWT_SECRET;
class UserController {
  // POST /api/users/register
  static async register(req, res) {
    try {
      const { name, email, password, role, phone } = req.body;

      const userExist = await User.findOne({ email });
      if (userExist) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role, phone });

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/users/login
  static login = async (req, res) => {
    try {
      const { email, password, googleId, name} = req.body;
      console.log(googleId);
      let user = await User.findOne({ email });
       
      if (googleId) {
        if (!user) {
          user = await User.create({
            name,
            email,
            googleId,
            password: "google-auth",
            
          });
        }

        const token = jwt.sign({ ID: user.id }, JWT_SECRET, { expiresIn: "4d" });

        return res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 4 * 24 * 60 * 60 * 1000,
          })
          .json({ message: "Login successful", user });
      }
      
      if (!user)
      {
        return res.status(400).json({ message: "Please register" });
      }
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ ID: user.id }, JWT_SECRET, { expiresIn: "4d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 4 * 24 * 60 * 60 * 1000,
      }).json({ message: "Login successful", token });

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
   

  // POST /api/users/logout
  static async logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.json({ message: "Logged out successfully" });
  }

  // GET /api/users/me
  static async getProfile(req, res) {
    try {
      
      res.json(req.user);
    } catch (error) {
      return res.status(401).json({ message: "error" });
    }
  }
  static userdt = async (req, res) => {
    try {
      const d = await User.findById(req.user.id);
      res.json(d);
    }
    catch (error) {
      return res.status(401).json({ message: "error" });
    }
  }
  static editprofile = async (req, res) => {
    try {
      const id = req.user.id;
      const { name, email, phone } = req.body;
      console.log(name);
      console.log(phone);
      const dt = await User.findByIdAndUpdate(id, {
        name, email, phone
      });

      res.json({ mesg: "updated" });

    }
    catch (error) {
      res.status(401).json({ mesg: error.message });
    }
  }



  static changePassword = async (req, res) => {
    try {
      const { id } = req.user.id;
       
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await User.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/profile");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }

  };

  static fget = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await User.findOne({ email: email });
       
      if (userData) {
        const randomString = randomstring.generate();
        await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        return res.status(200).json({ message: "Plz Check Your mail to reset Your Password!" });

      } else {
        res.status(400).json({ message: "You are not a registered Email" });
         
      }
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, token) => { 

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "kratikashrivastava200@gmail.com",
        pass: "mdft dxjx amkt febh",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html: "<p>Hello, " +
        name +
        ',Please click here to <a href="http://localhost:5173/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',

    });
  };
  static reset_password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await User.findOne({ token: token });
      console.log(tokenData);
      if (!tokenData)
      {
        return res.status(404).json({ message: "Invalid token" });
      }
        return res.status(200).json({ user_id: tokenData._id }); 
      
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  };
  static reset_Pswd = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      console.log("h", user_id);
      console.log(password);
      const newHashPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      return res.status(200).json({ message: "Password updated successfully" }); 
    } catch (error) {
       return res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = UserController;
