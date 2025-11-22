import Admin from "../models/admin.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utilities/jwt.js";
import { validatePassword } from "../utilities/passwordValidation.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    //  Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    //  Validate password format
    const { valid, message } = validatePassword(password);
    if (!valid) {
      return res.status(400).json({ message });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin with this email already exists",
      });
    }

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully👌",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Admin login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // input check
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Find admin with password field
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // If lockUntil exists but has passed, clear lock and failed attempts
    if (admin.lockUntil && admin.lockUntil <= Date.now()) {
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
      await admin.save();
    }

    // Check locked after potential reset
    if (admin.isLocked) {
      return res.status(403).json({
        success: false,
        message:
          "Account is temporarily locked due to multiple failed attempts",
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      // Increment failed attempts
      admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;

      if (admin.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      await admin.save();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset failed attempts on successful login
    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate tokens
    const accessToken = generateAccessToken(
      admin._id,
      admin.role,
      admin.tokenVersion
    );
    const refreshToken = generateRefreshToken(admin._id, admin.tokenVersion);

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    // Log error server-side; return generic message in production
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred while logging in" });
  }
};

// refresh token controller
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not provided",
      });
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find admin and check token version
    const admin = await Admin.findById(payload.sub);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive admin account",
      });
    }
    // Check token version
    if (payload.tokenVersion !== admin.tokenVersion) {
      return res.status(403).json({
        success: false,
        message: "Token has been invalidated",
      });
    }

    // Generate new access token (and optionally new refresh token)
    const newAccessToken = generateAccessToken(
      admin._id,
      admin.role,
      admin.tokenVersion
    );

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};


// Logout
const logout = async (req, res) => {
  try {
    // Increment tokenVersion to invalidate all tokens
    await Admin.findByIdAndUpdate(req.user.id, {
      $inc: { tokenVersion: 1 }
    });

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get current admin
const me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json({ success: true, data: admins });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export { register, login, refresh, logout, me,  getAllAdmins};
