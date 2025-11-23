const express = require("express");
const app = express();
const connectDB = require("./database/connectdb");
const web = require("./routes/web");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');

//dot env config
const dotenv = require("dotenv")
dotenv.config()

app.use(express.json());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:'/tmp/'

}))

app.use(cookieParser());
// Use this
app.use(cors({
  origin: 'https://client-x6vi.vercel.app',
  credentials: true 
}));



connectDB();
app.get("/api/check-token", (req, res) => {
  const token = req.cookies.token;
  console.log("Token from cookie:", token);
  res.json({ token });
});




// localhost:3000/api
app.use("/api", web);

app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${process.env.PORT}`);
});
