// server.js
// --- Main Express Server --- //

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware to parse JSON & enable CORS
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");

// Mount routes
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const storeRoutes = require("./routes/stores");
app.use("/api/stores", storeRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
