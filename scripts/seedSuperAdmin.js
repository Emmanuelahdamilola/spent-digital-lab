import mongoose from "mongoose";
import Admin from "../models/admin.js";
import config from "../config/config.js";

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoURI);
    console.log("Connected to MongoDB");

    const SUPERADMIN_EMAIL = "superadmin02@example.com"; 

    const existingAdmin = await Admin.findOne({ email: SUPERADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Superadmin already exists");
      await mongoose.connection.close();
      return process.exit(0);
    }

    // Create superadmin
    await Admin.create({
      name: "Super Admin",
      email: SUPERADMIN_EMAIL,
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
