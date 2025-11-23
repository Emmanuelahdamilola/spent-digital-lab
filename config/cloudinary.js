import { v2 as cloudinary } from "cloudinary";
import config from "./config.js";

cloudinary.config({
  cloud_name: config.cloudinary_cloud,
  api_key: config.cloudinary_key,
  api_secret: config.cloudinary_secret,
});

export default cloudinary;
