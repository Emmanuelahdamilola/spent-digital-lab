import express from "express";
import mongoDB from "./config/database.js";
import config from "./config/config.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many attempts, please try again later'
});

mongoDB();

app.get("/", (req, res) => {
  res.send("API is hitted!");
});

// routes
app.use("/api/admin", authLimiter, adminRoutes);


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong' 
  });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
