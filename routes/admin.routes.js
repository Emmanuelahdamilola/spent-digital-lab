import express from "express";

import { 
  register, 
  login, 
  refresh, 
  logout, 
  me,
  getAllAdmins
} from "../controllers/admin.controller.js";

import { authenticate, requireRole } from "../middleware/auth.js";


const router = express.Router();

// Auth routes
router.post("/auth/login", login);
router.get("/auth/refresh", refresh);
router.post("/auth/logout", authenticate, logout);
router.get("/auth/me", authenticate, me);

// Admin management routes (only superadmin can create/view admins)
router.post("/admins", authenticate, requireRole("superadmin"), register);
router.get("/admins", authenticate, requireRole("superadmin"), getAllAdmins);

export default router;
