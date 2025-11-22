import mongoose from "mongoose";
import Admin from "../models/admin.js";
import config from "../config/config.js";

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log("Connected to MongoDB");

    // Check if superadmin exists
    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Superadmin already exists");
      await mongoose.connection.close();
      return process.exit(0);
    }

    // Create superadmin — password will auto-hash via schema pre-save hook
    await Admin.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "Admin123!", 
      role: "superadmin",
    });

    console.log("Superadmin created successfully");

    // Close DB connection
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("Error seeding superadmin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedSuperAdmin();
