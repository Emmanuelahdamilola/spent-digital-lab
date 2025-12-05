import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

export class UploadService {
  async uploadImage(buffer, options = {}) {
    const defaultOptions = {
      folder: "admin_panel/images",
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      ...options,
    };
    return uploadBufferToCloudinary(buffer, defaultOptions);
  }

  async uploadPDF(buffer, options = {}) {
    const defaultOptions = {
      folder: "admin_panel/documents",
      resource_type: "raw",
      ...options,
    };
    return uploadBufferToCloudinary(buffer, defaultOptions);
  }

  async deleteFile(publicId, resourceType = "image") {
    return deleteFromCloudinary(publicId, resourceType);
  }
}


export const uploadService = new UploadService();
