Server – Job Portal API

This repository contains the backend/server of the Job Portal Application, built using Node.js, Express.js, MongoDB (Mongoose), and JWT authentication.
It provides secure REST APIs for user authentication, job posting, job editing, deleting, and managing user profiles.

🚀 Features

User Registration & Login

JWT-Based Authentication

Forgot Password + Email Reset Link

CRUD Operations for Job Posts

Protected Routes (Auth Middleware)

MongoDB Atlas Integration

Fully deployed on Render

🛠️ Tech Stack 

Server	Node.js, Express.js

Database	MongoDB Atlas, Mongoose

Authentication	JWT, bcrypt

Email Service	Nodemailer (Gmail SMTP)

Deployment	Render

🔗 API Base URL

https://server-s9je.onrender.com/api



📚 API Endpoints

Auth Routes

Method	Endpoint	Description

POST	  /register	  Register new user

POST	  /login	    Login user

GET	    /me	        Get logged-in user profile 

Job Routes

Method	Endpoint	    Description

POST	  /postjob	    Create job post

GET	   /getjobs	      Fetch all jobs

GET	   /jobview/:id	  Get single job by ID


🔐 Authentication Workflow

User logs in → Server sends JWT token via cookies

Cookie is stored with HttpOnly & Secure

Protected routes require auth middleware

If token invalid → 401 Unauthorized

Project link: https://client-x6vi.vercel.app
