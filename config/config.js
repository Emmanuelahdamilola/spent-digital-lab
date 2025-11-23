import dotenv from "dotenv";
dotenv.config();

export default {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expiry: process.env.JWT_ACCESS_EXP || "15m",
  jwt_refresh_expiry: process.env.JWT_REFRESH_EXP || "7d",
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  cloudinary_key: process.env.CLOUDINARY_KEY,
  cloudinary_secret: process.env.CLOUDINARY_SECRET,
  cloudinary_cloud: process.env.CLOUDINARY_CLOUD_NAME,
};


// validate required env variables
const requiredEnvVariables = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
requiredEnvVariables.forEach(key => {
  if (!process.env[key]){
    console.error(`Error: Missing required environment variable ${key}`);
    process.exit(1);
  }
})

// Validate Cloudinary env vars
const cloudinaryRequired = ['CLOUDINARY_KEY', 'CLOUDINARY_SECRET', 'CLOUDINARY_CLOUD_NAME'];
cloudinaryRequired.forEach(key => {
  if (!process.env[key]) {
    console.warn(`Warning: Missing Cloudinary config: ${key}`);
  }
});
