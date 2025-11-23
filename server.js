import express from "express";
import cookieParser from "cookie-parser";
import mongoDB from "./config/database.js";
import config from "./config/config.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { authLimiter } from "./middlewares/rateLimiter.js";
import researchRoutes from './routes/research.route.js';

const app = express();
// Connect to DB
mongoDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Apply rate limiter ONLY to /auth routes
app.use("/api/admin/auth", authLimiter); 

// Routes
app.use("/api/admin", adminRoutes);  
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/research', researchRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is hitted!");
});


// Error handler
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 10MB",
    });
  }

  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
