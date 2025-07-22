require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes")

const app = express();

// Connect to MongoDB
connectDB();

// List of allowed frontend origins
const allowedOrigins = [
  "https://expense-tracker-1-wbcq.onrender.com"
];

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to parse JSON
app.use(express.json());

// Serve static files (e.g. uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin",adminRoutes)

// Start the server
const PORT =5000;
app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
