// Express.js: Understanding app.use(), app.get(), and app.post()

const express = require("express");
const app = express();

/*
  🔸 app.use(): Middleware for ALL HTTP methods
  🔸 app.get(): Handles GET requests
  🔸 app.post(): Handles POST requests
*/

// ✔ Equivalent to /ab?cd — 'b' is optional
app.get(/^\/ab?cd$/, (req, res) => {
  res.send("✅ Route matched: /ab?cd — 'b' is optional");
});

// ✔ Equivalent to /ab*cd — matches abXYZcd, ab123cd, etc.
app.get(/^\/ab.*cd$/, (req, res) => {
  res.send("✅ Route matched: /ab*cd — matches abXYZcd, ab123cd, etc.");
});

// ✔ Equivalent to /ab+cd — 'b' must occur one or more times
app.get(/^\/ab+cd$/, (req, res) => {
  res.send("✅ Route matched: /ab+cd — 'b' must occur 1 or more times");
});

// ========== LOGIN ROUTE ========== //

// 🛡️ Middleware for /login (runs on all methods: GET, POST, etc.)
app.use("/login", (req, res, next) => {
  console.log("🔐 Middleware: Request received at /login");
  next(); // Pass to next matching route
});

// ✅ GET /login
app.get("/login", (req, res) => {
  res.send("✅ GET /login: Welcome to login page!");
});

// ✅ POST /login
app.post("/login", (req, res) => {
  res.send(`✅ POST /login: Hello, You are logged in.`);
});

// ========== TEST ROUTE ========== //

// 🛡️ Middleware for /test
app.use("/test", (req, res, next) => {
  console.log("🧪 Middleware: /test route accessed");
  next();
});

// ✅ GET /test
app.get("/test", (req, res) => {
  res.send("✅ GET /test: Testing successful.");
});

// ✅ POST /test
app.post("/test", (req, res) => {
  res.send(`✅ POST /test: Data received.`);
});
// ========== QUERY & PARAMS EXAMPLES ========== //

// ✅ GET /search?term=devtinder
app.get("/search", (req, res) => {
  const searchTerm = req.query.term;
  res.send(`🔍 You searched for: ${searchTerm}`);
});

// ✅ GET /user/42
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`👤 User ID requested: ${userId}`);
});


// ========== DASHBOARD / HOME ROUTE ========== //

// Global middleware for logging unhandled routes
app.use((req, res, next) => {
  console.log("🌐 Global Middleware: No specific route matched yet.");
  next();
});

// ✅ GET /
app.get("/", (req, res) => {
  res.send("🏠 GET /: Welcome to the Dashboard!");
});

// ❌ If no route matches — 404 Handler
app.use((req, res) => {
  res.status(404).send("❌ 404: Page not found");
});

// Start the server
app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
