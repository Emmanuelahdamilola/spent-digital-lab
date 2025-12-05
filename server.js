import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoDB from "./config/database.js";
import config from "./config/config.js";

import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { authLimiter } from "./middleware/rateLimiter.js";
import researchRoutes from './routes/research.route.js';
import publicationRoutes from './routes/publication.route.js';
import eventsRoutes from './routes/events.route.js';
import teamRoutes from './routes/team.route.js';
import programsRoutes from './routes/programs.route.js';

const app = express();


// 📌 DATABASE CONNECTION
mongoDB();


// 📌 GLOBAL MIDDLEWARES
// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
);

// Request logging (dev mode only)
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Rate limit only auth routes
app.use("/api/admin/auth", authLimiter);


// 📌 ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/admin/research", researchRoutes);
app.use("/api/admin/publications", publicationRoutes);
app.use("/api/admin/events", eventsRoutes);
app.use("/api/admin/team", teamRoutes);
app.use("/api/admin/programs", programsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// 📌 ERROR HANDLER
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

// 📌 START SERVER
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
