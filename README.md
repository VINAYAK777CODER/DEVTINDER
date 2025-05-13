# 🚀 Node.js + Express.js Project Setup Checklist

A full journey from initializing a repo to building APIs with validation and authentication.

---

## 📁 Project Initialization

- ✅ Created repository
- ✅ Initialized the repository
- ✅ Created `.gitignore` (added `node_modules`, `package-lock.json`)
- ✅ Initialized Git
- ✅ Created remote repo on GitHub
- ✅ Pushed all code to remote origin

---

## 📦 Package Installation

- ✅ Installed Express
- ✅ Installed Nodemon
- ✅ Installed Mongoose
- ✅ Installed Validator
- ✅ Installed Bcrypt
- ✅ Installed Password Validator

---

## ⚙️ Server Setup

- ✅ Created Express server
- ✅ Configured to listen on port 3000
- ✅ Added express.json middleware

---

## 🔁 Routing

- ✅ Created routes: `/test`, `/hello`, `/`, `/hello/2`, `/xyz`
- ✅ Tested route order
- ✅ Played with route extensions (`?`, `+`, `*`, `()`, RegEx like `/.*fly$/`)
- ✅ Read query parameters
- ✅ Handled dynamic routes
- ✅ Used multiple route handlers
- ✅ Used `next()` in middleware
- ✅ Explored `app.use()` and `app.all()`

---

## 🧪 API Testing (Postman)

- ✅ Installed Postman and created workspace/collection
- ✅ Tested GET, POST, PATCH, DELETE routes

---

## 🔐 Middleware

- ✅ Created dummy admin auth middleware
- ✅ Created user route middleware (excluded `/user/login`)
- ✅ Handled errors using `app.use((err, req, res, next) => {})`

---

## 🌍 MongoDB Integration

- ✅ Created MongoDB Atlas cluster
- ✅ Installed Mongoose
- ✅ Connected to database `/devTinder`
- ✅ Called `connectDB` before starting server

---

## 🧾 Schema & Model

- ✅ Created `userSchema` and `userModel`
- ✅ Added validation: `required`, `unique`, `lowercase`, `minLength`, `trim`, `default`
- ✅ Created custom validation for gender
- ✅ Added `timestamps` to schema

---

## 🔧 API Development

- ✅ Created `POST /signup` API
- ✅ Made signup dynamic (accept user input)
- ✅ Handled duplicate emails with `User.findOne`
- ✅ Created:
  - ✅ `GET /user?email=...`
  - ✅ `GET /feed` (get all users)
  - ✅ `GET /user/:id`
  - ✅ `DELETE /user/:id`
  - ✅ `PATCH /user/:id`
  - ✅ `PUT` and discussed difference with `PATCH`
  - ✅ `PATCH user by email ID`

---

## 📑 Data Validation

- ✅ Validated `req.body` in `POST /signup`
- ✅ Used `validator` functions for:
  - ✅ Email
  - ✅ Password
  - ✅ Photo URL
- ✅ Never trusted raw input (`req.body`)
- ✅ Added API-level validation on signup & patch
- ✅ Sanitized and validated all fields

---

## 🔐 Password Handling

- ✅ Installed `bcrypt`
- ✅ Hashed passwords in `POST /signup`
- ✅ Created `POST /login` API
- ✅ Compared hashed passwords
- ✅ Handled login errors (invalid email/password)


-install cookie-parser
-just send a dummy cookie to the user
-create GET/ profile API and checks if you get the cookie back
-install jsonwebtoken
- in login API ,after email and password validation,create a jwt token and send it to user in cookie
- read the cookie inside your profile API and find the logged in user
- user auth middleware
- added the user auth middleware in profile api and made the sent connection api
- cookie and token expiry feature added