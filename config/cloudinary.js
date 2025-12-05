import { v2 as cloudinary } from "cloudinary";
import config from "./config.js";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: config.cloudinary_cloud,
  api_key: config.cloudinary_key,
  api_secret: config.cloudinary_secret,
});

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId
 * @param {string} resourceType
 * @returns {Promise<Object>}
 */
export const deleteFromCloudinary = (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

// Default export in case you need full Cloudinary object
export default cloudinary;
